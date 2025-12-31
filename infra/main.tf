terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Backend configuration - uncomment and configure for remote state
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "isdoc-reader/terraform.tfstate"
  #   region = "eu-central-1"
  # }
}

# Primary provider for most resources
provider "aws" {
  region = var.aws_region
}

# Provider for ACM certificate (must be us-east-1 for CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
