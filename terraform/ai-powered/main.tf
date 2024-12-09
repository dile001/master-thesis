module "shared" {
  source = "../shared"
}

resource "aws_lambda_function" "ai_search_lambda" {
  function_name = "ai-search-query"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  role          = module.shared.lambda_execution_role_arn

  source_code_hash = filebase64sha256("path-to-your-zip-file")
}

resource "aws_opensearch_domain" "ai_search" {
  domain_name = "ai-opensearch"
  cluster_config {
    instance_type = "t3.medium.search"
  }

  tags = {
    Environment = "AI-Powered"
  }
}
