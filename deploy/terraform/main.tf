terraform { required_version = ">= 1.6.0" }
resource "aws_s3_bucket" "documents" { bucket = "hr-platform-documents-${var.environment}" }
output "documents_bucket" { value = aws_s3_bucket.documents.id }
