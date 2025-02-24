output "opensearch_domain_name" {
  description = "OpenSearch domain name"
  value       = aws_opensearch_domain.default_search.domain_name
}

output "opensearch_endpoint" {
  description = "OpenSearch endpoint"
  value       = aws_opensearch_domain.default_search.endpoint
}
