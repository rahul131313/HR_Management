variable "aws_region" { type = string, default = "ap-south-1" }
variable "environment" { type = string, default = "dev" }
variable "vpc_id" { type = string, default = "" }
variable "redis_subnet_ids" { type = list(string), default = [] }
