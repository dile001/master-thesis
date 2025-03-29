module "shared" {
  source = "../shared"
}

provider "aws" {
  region = var.region
}

resource "aws_iam_role" "ai_lambda_exec_role" {
  name = "ai-search-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "ai_lambda_policy" {
  name = "ai-search-lambda-policy"
  role = aws_iam_role.ai_lambda_exec_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "bedrock:*",
          "aoss:*",
          "logs:*"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_lambda_function" "ai_search_lambda" {
  function_name = var.ai_lambda_function_name
  role          = aws_iam_role.ai_lambda_exec_role.arn
  package_type  = "Image"
  image_uri     = var.ecr_image_uri
  timeout       = 10
  memory_size   = 1024
}

resource "aws_apigatewayv2_api" "api" {
  name          = "ai-search-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.ai_search_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "search_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /search"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ai_search_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

output "ai_api_url" {
  description = "API Gateway URL for AI-powered search"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

resource "aws_opensearchserverless_security_policy" "encryption_policy" {
  name        = "ai-search-encryption-policy"
  type        = "encryption"
  policy      = jsonencode({
    Rules = [
      {
        ResourceType = "collection",
        Resource     = ["collection/ai-search-collection"]
      }
    ],
    AWSOwnedKey = true
  })
}

resource "aws_opensearchserverless_collection" "ai_search" {
  name = "ai-search-collection"
  type = "VECTORSEARCH"

  description = "OpenSearch collection for AI-powered search"
}

resource "aws_opensearchserverless_access_policy" "ai_search_policy" {
  name = "ai-search-access-policy"
  type = "data"

  policy = jsonencode([
    {
      Rules = [
        {
          ResourceType = "index",
          Resource = ["index/ai-search-collection/*"],
          Permission = [
            "aoss:CreateIndex",
            "aoss:ReadDocument",
            "aoss:WriteDocument"
          ]
        },
        {
          ResourceType = "collection",
          Resource = ["collection/ai-search-collection"],
          Permission = [
            "aoss:DescribeCollectionItems"
          ]
        }
      ],
      Principal = [aws_iam_role.ai_lambda_exec_role.arn]
    }
  ])
}


resource "aws_iam_role_policy" "lambda_ecr_access" {
  name = "LambdaECRAccess"
  role = aws_iam_role.ai_lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_ecr_access" {
  role       = aws_iam_role.ai_lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_ecr_repository" "ai_search_repo" {
  name = "ai-search-lambda"
}