output "ai_lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.ai_search_lambda.function_name
}

output "ai_lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.ai_search_lambda.arn
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "opensearch_collection_name" {
  value = aws_opensearchserverless_collection.ai_search.name
}

output "opensearch_collection_id" {
  value = aws_opensearchserverless_collection.ai_search.id
}
