resource "aws_s3_bucket" "shared_bucket" {
  bucket = "shared-bucket-for-all-systems"
  tags = {
    Environment = "Shared"
  }
}