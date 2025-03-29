module "shared" {
  source = "../shared"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "pagefind_lambda" {
  function_name = var.lambda_function_name
  runtime       = var.lambda_runtime
  handler       = var.lambda_handler
  role          = module.shared.lambda_execution_role_arn

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      S3_BUCKET = module.shared.s3_bucket_name
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "pagefind-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.pagefind_lambda.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /search"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigateway_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pagefind_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

resource "aws_iam_policy" "pagefind_s3_access" {
  name = "PagefindLambdaS3Access"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:ListBucket"
        ],
        Resource = "arn:aws:s3:::shared-bucket-for-all-systems"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject"
        ],
        Resource = "arn:aws:s3:::shared-bucket-for-all-systems/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_pagefind_s3_access" {
  role       = module.shared.lambda_execution_role_name
  policy_arn = aws_iam_policy.pagefind_s3_access.arn
}
