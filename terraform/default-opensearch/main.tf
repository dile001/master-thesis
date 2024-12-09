module "shared" {
  source = "../shared"
}

resource "aws_opensearch_domain" "default_search" {
  domain_name = "default-opensearch"
  cluster_config {
    instance_type = "t3.small.search"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  tags = {
    Environment = "Default"
  }
}
