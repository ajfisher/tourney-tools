# Add the certificates for the custom domain
resource "aws_acm_certificate" "app_cert" {
  domain_name       = "www.bout.haus"
  validation_method = "DNS"
  provider          = "aws.useast"

  lifecycle {
    create_before_destroy = true
  }
}

# sets up the dns entry to be used for verification
resource "aws_route53_record" "app_cert_validation" {
  provider  = "aws"
  name      = "${aws_acm_certificate.app_cert.domain_validation_options.0.resource_record_name}"
  type      = "${aws_acm_certificate.app_cert.domain_validation_options.0.resource_record_type}"
  zone_id   = "${var.zone_id}"
  records   = ["${aws_acm_certificate.app_cert.domain_validation_options.0.resource_record_value}"]
  ttl       = 60
}

resource "aws_acm_certificate_validation" "app_cert" {
  provider                = "aws.useast"
  certificate_arn         = "${aws_acm_certificate.app_cert.arn}"
  validation_record_fqdns = ["${aws_route53_record.app_cert_validation.fqdn}"]
}

# add the apex domain cert now
resource "aws_acm_certificate" "apex_cert" {
  domain_name       = "bout.haus"
  validation_method = "DNS"
  provider          = "aws.useast"

  lifecycle {
    create_before_destroy = true
  }
}

# sets up the dns entry to be used for verification
resource "aws_route53_record" "apex_cert_validation" {
  provider  = "aws"
  name      = "${aws_acm_certificate.apex_cert.domain_validation_options.0.resource_record_name}"
  type      = "${aws_acm_certificate.apex_cert.domain_validation_options.0.resource_record_type}"
  zone_id   = "${var.zone_id}"
  records   = ["${aws_acm_certificate.apex_cert.domain_validation_options.0.resource_record_value}"]
  ttl       = 60
}

resource "aws_acm_certificate_validation" "apex_cert" {
  provider                = "aws.useast"
  certificate_arn         = "${aws_acm_certificate.apex_cert.arn}"
  validation_record_fqdns = ["${aws_route53_record.apex_cert_validation.fqdn}"]
}
