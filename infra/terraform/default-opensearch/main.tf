module "shared" {
  source = "../shared"
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "opensearch_access_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.lambda_exec_role.arn]
    }

    actions = [
      "es:ESHttpGet",
      "es:ESHttpPost",
      "es:ESHttpPut"
    ]

    resources = [
      "arn:aws:es:eu-central-1:${data.aws_caller_identity.current.account_id}:domain/${var.opensearch_domain_name}/*"
    ]
  }
}

resource "aws_opensearch_domain" "default_search" {
  domain_name = "default-opensearch"

  cluster_config {
    instance_type = "t3.small.search"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  access_policies = data.aws_iam_policy_document.opensearch_access_policy.json

  tags = {
    Environment = "Default"
  }
}

resource "aws_iam_role_policy" "lambda_opensearch_policy" {
  name = "lambda-opensearch-access"
  role = module.shared.lambda_execution_role_arn

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "es:ESHttpGet",
          "es:ESHttpPost"
        ],
        Resource = "*"
      }
    ]
  })
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "search_handler" {
  function_name = "default-opensearch-lambda"
  role          = module.shared.lambda_execution_role_arn
  handler       = "index.lambda_handler"
  runtime       = "nodejs18.x"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      OPENSEARCH_ENDPOINT = aws_opensearch_domain.default_search.endpoint
      OPENSEARCH_INDEX    = "your-index-name"
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "default-search-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.search_handler.invoke_arn
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

output "api_gateway_url" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

resource "aws_lambda_permission" "allow_apigateway_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.search_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}