
## CI/CD user role for managing pipeline for AWS ECR resources
module "ecr_ecs_ci_user" {
  source               = "github.com/Jareechang/tf-modules//iam/ecr?ref=v1.0.12"
  env                  = var.env
  project_id           = var.project_id
  create_ci_user       = true
  other_iam_statements = {}
  ecr_resource_arns = [
    "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/web/${var.project_id}",
    "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/web/${var.project_id}/*"
  ]
}
output "aws_iam_access_id" {
  value = module.ecr_ecs_ci_user.aws_iam_access_id
}

output "aws_iam_access_key" {
  value     = module.ecr_ecs_ci_user.aws_iam_access_key
  sensitive = true
}
