variable "lambda_function_name" {
  description = "Lambda function name for Pagefind"
  type        = string
  default     = "pagefind-query"
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs18.x"
}

variable "lambda_handler" {
  description = "Lambda handler"
  type        = string
  default     = "index.handler"
}
