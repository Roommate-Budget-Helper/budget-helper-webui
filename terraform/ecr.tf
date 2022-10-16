data "aws_caller_identity" "current" {}

resource "aws_ecr_repository" "main" {
  name                 = "web/${var.project_id}/nextjs"
  image_tag_mutability = "MUTABLE"
}

output "ecr_repo_url" {
  value = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

output "ecr_repo_path" {
  value = aws_ecr_repository.main.name
}

output "aws_region" {
  value = var.aws_region
}
