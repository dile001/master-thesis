variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "ai_lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "ai-search-query"
}

variable "ecr_image_uri" {
  description = "URI of the container image in ECR"
  type        = string
}

variable "image_tag" {
  default = "latest"
}