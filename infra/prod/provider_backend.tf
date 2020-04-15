provider "aws" {
  region = "ap-southeast-2"
  version = "~> 2.0"
}

# this is used for dealing with ACM
provider "aws" {
  alias     = "useast"
  region    = "us-east-1"
  version   = "~> 2.0"
}

resource "aws_s3_bucket" "bouthaus-site-terraform-state" {
  bucket  = "bouthaus-site-terraform-state"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }

  tags {
    Name = "Terraform S3 remote state store"
  }
}

terraform {
  backend "s3" {
    region = "ap-southeast-2"
    bucket = "bouthaus-site-terraform-state"
    key = "bouthaus_site"
  }
#  backend "local" {
#    path = "./terraform.tfstate"
#  }
}
