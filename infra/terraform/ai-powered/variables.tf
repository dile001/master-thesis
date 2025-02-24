variable "ai_lambda_function_name" {
  description = "Lambda function name for AI-powered search"
  type        = string
  default     = "ai-search-query"
}

variable "ai_lambda_runtime" {
  description = "Lambda runtime for AI-powered search"
  type        = string
  default     = "nodejs18.x"
}

variable "ai_opensearch_instance_type" {
  description = "Instance type for AI-powered OpenSearch"
  type        = string
  default     = "t3.medium.search"
}

variable "bedrock_model_name" {
  description = "Model name for AWS Bedrock"
  type        = string
  default     = "foundation-model-name"
}
