variable "opensearch_instance_type" {
  description = "Instance type for OpenSearch"
  type        = string
  default     = "t3.small.search"
}

variable "opensearch_domain_name" {
  description = "OpenSearch domain name"
  type        = string
  default     = "default-opensearch"
}
