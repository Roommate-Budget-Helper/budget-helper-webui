resource "aws_ecs_cluster" "web_cluster" {
  name = "web-cluster-${var.project_id}-${var.env}"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_launch_configuration" "ecs_launch_config" {
  image_id             = "ami-00eb90638788e810f"
  iam_instance_profile = aws_iam_instance_profile.ecs_agent.name
  security_groups      = [aws_security_group.ecs_sg.id]
  instance_type        = "t2.micro"
}

resource "aws_autoscaling_group" "ecs-asg" {
  name                      = "asg"
  vpc_zone_identifier       = [for subnet in module.networking.public_subnets : subnet.id]
  launch_configuration      = aws_launch_configuration.ecs_launch_config.name
  desired_capacity          = 1
  min_size                  = 1
  max_size                  = 1
  health_check_grace_period = 300
  health_check_type         = "EC2"
}

locals {
  # Target port to expose
  target_port = 3000
  ## ECS Service config
  ecs_memory         = 512
  ecs_launch_type    = "EC2"
  ecs_desired_count  = 1
  ecs_network_mode   = "awsvpc"
  ecs_container_name = "nextjs-image"
  ecs_log_group      = "/aws/ecs/${var.project_id}-${var.env}"
  # Retention in days
  ecs_log_retention = 1
}

data "template_file" "task_def_generated" {
  template = file("./task-definitions/service.json.tpl")
  vars = {
    env                = var.env
    port               = local.target_port
    name               = local.ecs_container_name
    memory             = local.ecs_memory
    aws_region         = var.aws_region
    ecs_execution_role = module.ecs_roles.ecs_execution_role_arn
    log_group          = local.ecs_log_group
    launch_type        = local.ecs_launch_type
    network_mode       = local.ecs_network_mode
  }
}

# Create a static version of task definition for CI/CD
resource "local_file" "output_task_def" {
  content         = data.template_file.task_def_generated.rendered
  file_permission = "644"
  filename        = "./task-definitions/service.latest.json"
}


resource "aws_ecs_task_definition" "nextjs" {
  family                   = "task-definition-node"
  network_mode             = "awsvpc"
  execution_role_arn       = module.ecs_roles.ecs_execution_role_arn
  task_role_arn            = module.ecs_roles.ecs_task_role_arn
  requires_compatibilities = [local.ecs_launch_type]
  container_definitions = jsonencode(
    jsondecode(
      data.template_file.task_def_generated.rendered
    ).containerDefinitions
  )
}

resource "aws_ecs_service" "web_ecs_service" {
  name            = "web-service-${var.project_id}-${var.env}"
  cluster         = aws_ecs_cluster.web_cluster.id
  task_definition = aws_ecs_task_definition.nextjs.arn
  desired_count   = local.ecs_desired_count
  launch_type     = local.ecs_launch_type

  load_balancer {
    target_group_arn = module.ecs_tg.tg.arn
    container_name   = local.ecs_container_name
    container_port   = local.target_port
  }

  network_configuration {
    subnets         = module.networking.private_subnets[*].id
    security_groups = [aws_security_group.ecs_sg.id]
  }

  tags = {
    Name = "web-service-${var.project_id}-${var.env}"
  }

  depends_on = [
    module.alb.lb,
    module.ecs_tg.tg
  ]
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = local.ecs_log_group
  retention_in_days = local.ecs_log_retention
}

module "ecs_roles" {
  source                    = "github.com/Jareechang/tf-modules//iam/ecs?ref=v1.0.1"
  create_ecs_execution_role = true
  create_ecs_task_role      = true

  # Extend baseline policy statements (ignore for now)
  ecs_execution_policies_extension = {}
}
