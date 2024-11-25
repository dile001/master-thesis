# Provider Configuration
provider "aws" {
  region = "us-east-1"
}

# S3 Bucket for static website or indexed files
resource "aws_s3_bucket" "static_site_bucket" {
  bucket = "example-static-site-bucket"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name        = "StaticSiteBucket"
    Environment = "Dev"
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Lambda to interact with S3
resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "lambda_s3_policy"
  description = "Policy for Lambda to access S3 bucket"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Effect   = "Allow"
        Resource = [
          "${aws_s3_bucket.static_site_bucket.arn}/*"
        ]
      }
    ]
  })
}

# Attach Policy to Role
resource "aws_iam_role_policy_attachment" "lambda_s3_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

# Lambda Function
resource "aws_lambda_function" "search_lambda" {
  function_name = "search-lambda"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "lambda_function.lambda_handler"

  # Path to the zipped code
  filename         = "lambda_function.zip"
  source_code_hash = filebase64sha256("lambda_function.zip")

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.static_site_bucket.bucket
    }
  }

  tags = {
    Name        = "SearchLambda"
    Environment = "Dev"
  }
}

# Outputs
output "s3_bucket_name" {
  value = aws_s3_bucket.static_site_bucket.bucket
}

output "lambda_function_arn" {
  value = aws_lambda_function.search_lambda.arn
}
