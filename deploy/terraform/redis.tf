resource "aws_elasticache_subnet_group" "redis" { name = "hr-platform-${var.environment}-redis", subnet_ids = var.redis_subnet_ids }
