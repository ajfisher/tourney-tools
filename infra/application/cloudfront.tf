# set up the cloudfront distribution to access the S3 bucket.
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "cloudfront origin access identity"
}

resource "aws_cloudfront_distribution" "web_app" {
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  http_version        = "http2"
  wait_for_deployment = false

  aliases = [ "bout.haus" ]

  # default origin for the html
  origin {
    origin_id   = "origin-web-app-${aws_s3_bucket.website_code.id}"
    domain_name = "${aws_s3_bucket.website_code.bucket_regional_domain_name}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }

  origin {
    origin_id   = "bout-haus-api-routing"
    domain_name = "c4ekmno7s8.execute-api.ap-southeast-2.amazonaws.com"

    custom_origin_config {
      http_port               = 80
      https_port              = 443
      origin_protocol_policy  = "https-only"
      origin_ssl_protocols    = ["TLSv1.2"]
    }
  }

  default_root_object = "index.html"

  custom_error_response {
    error_code = "403"
    response_page_path = "/index.html"
    response_code = "200"
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
    target_origin_id = "origin-web-app-${aws_s3_bucket.website_code.id}"

    // don't allow any cache set in cf - it should all come from response
    // headers of origin - this is from lambda as well
    # min_ttl          = "0"
    # default_ttl      = "30"                //3600
    # max_ttl          = "30"               //86400

    // This redirects any HTTP request to HTTPS. Security first!
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string  = false
      # headers       = ["Origin"]

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern      = "/api/*"
    allowed_methods   = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods    = ["GET", "HEAD"]
    target_origin_id  = "bout-haus-api-routing"

    default_ttl       = 0
    min_ttl           = 0
    max_ttl           = 0

    forwarded_values {
      query_string  = true
      # headers       = ["X-Tournament-Secret"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    # redirect the request if needed
#    lambda_function_association {
#      event_type = "origin-request"
#      lambda_arn = "${aws_lambda_function.redirect_lambda.qualified_arn}"
#    }
#
#    # add the correct header
#    lambda_function_association {
#      event_type  = "origin-response"
#      lambda_arn  = "${aws_lambda_function.header_lambda.qualified_arn}"
#    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn       = "${aws_acm_certificate.apex_cert.arn}"
    ssl_support_method        = "sni-only"
    minimum_protocol_version  = "TLSv1.2_2018"
  }

  depends_on = [ "aws_acm_certificate_validation.apex_cert" ]
}

resource "aws_route53_record" "web_apex" {
  # need to use the root account due to the top level domain
  provider  = "aws"
  zone_id   = "${var.zone_id}"
  name      = "bout.haus"
  type      = "A"
  alias {
    name    = "${aws_cloudfront_distribution.web_app.domain_name}"
    zone_id = "${aws_cloudfront_distribution.web_app.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_cloudfront_distribution" "redirect_distribution" {
  enabled             = true
  is_ipv6_enabled     = true

  aliases             = [ "www.bout.haus" ]
  price_class         = "PriceClass_100"
  wait_for_deployment = false

  origin {
    domain_name = "${aws_s3_bucket.redirect_to_apex.website_endpoint}"
    origin_id   = "origin-redirect-app-${aws_s3_bucket.redirect_to_apex.id}"

    // The redirect origin must be http even if it's on S3 for redirects to work properly
    // so the website_endpoint is used and http-only as S3 doesn't support https for this
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id  = "origin-redirect-app-${aws_s3_bucket.redirect_to_apex.id}"

    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      query_string = false
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    max_ttl = 31536000
    default_ttl = 86400
  }

  viewer_certificate {
    acm_certificate_arn = "${aws_acm_certificate.app_cert.arn}"
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  restrictions {
    "geo_restriction" {
      restriction_type = "none"
    }
  }

  depends_on = [ "aws_acm_certificate_validation.app_cert" ]
}

resource "aws_route53_record" "web_redirect" {
  # need to use the root account due to the top level domain
  provider  = "aws"
  zone_id   = "${var.zone_id}"
  name      = "www"
  type      = "A"
  alias {
    name    = "${aws_cloudfront_distribution.redirect_distribution.domain_name}"
    zone_id = "${aws_cloudfront_distribution.redirect_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}
