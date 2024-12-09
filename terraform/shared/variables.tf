variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "lambda_execution_role_name" {
  description = "Lambda execution role name"
  type        = string
  default     = "LambdaExecutionRole"
}

variable "bucket_name" {
  description = "S3 bucket name"
  type        = string
  default     = "shared-bucket-for-all-systems"
}
