output "ai_opensearch_domain_name" {
  description = "AI-powered OpenSearch domain name"
  value       = aws_opensearch_domain.ai_search.domain_name
}

output "ai_opensearch_endpoint" {
  description = "AI-powered OpenSearch endpoint"
  value       = aws_opensearch_domain.ai_search.endpoint
}

output "ai_lambda_function_name" {
  description = "Lambda function name for AI-powered search"
  value       = aws_lambda_function.ai_search_lambda.function_name
}

output "ai_lambda_function_arn" {
  description = "Lambda function ARN for AI-powered search"
  value       = aws_lambda_function.ai_search_lambda.arn
}