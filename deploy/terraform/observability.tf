resource "aws_cloudwatch_log_group" "api" { name = "/hr-platform/${var.environment}/api", retention_in_days = 30 }
resource "aws_sns_topic" "alerts" { name = "hr-platform-${var.environment}-alerts" }
output "alerts_topic_arn" { value = aws_sns_topic.alerts.arn }
