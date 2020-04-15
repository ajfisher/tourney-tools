output "deploy_user_access_key" {
  value = "${aws_iam_access_key.deploy_user.id}"
}

output "deploy_user_secret_key" {
  value = "${aws_iam_access_key.deploy_user.secret}"
}

