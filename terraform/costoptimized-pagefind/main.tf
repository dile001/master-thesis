module "shared" {
  source = "../shared"
}

resource "aws_lambda_function" "pagefind_lambda" {
  function_name = "pagefind-query"
  s3_bucket     = module.shared.s3_bucket_name
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  role          = module.shared.lambda_execution_role_arn

  source_code_hash = filebase64sha256("path-to-your-zip-file")
}
