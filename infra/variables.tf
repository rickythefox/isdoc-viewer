variable "aws_region" {
  description = "AWS region for S3 bucket"
  type        = string
  default     = "eu-central-1"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "isdoc-reader.cz"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "isdoc-reader"
}

variable "github_repo" {
  description = "GitHub repository in format owner/repo"
  type        = string
  # Update this to your actual repo
}
