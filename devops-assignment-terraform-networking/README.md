# DevOps API – Terraform Networking (Part 2)

This folder creates the foundational AWS network for the Node.js API assignment.

## What this creates

- One VPC (`10.0.0.0/16`) with DNS support and hostnames enabled
- Two public subnets in two Availability Zones
- Two private subnets in two Availability Zones
- One Internet Gateway attached to the VPC
- A public route table with a default route to the Internet Gateway
- One NAT Gateway in the first public subnet (configurable)
- A private route table with a default route to the NAT Gateway
- Route table associations for all subnets

The public subnets are intended for the Application Load Balancer. The private subnets are intended for ECS Fargate tasks.

## Architecture decisions

- ECS tasks will not receive public IP addresses.
- The ALB will be placed in both public subnets.
- ECS tasks will be placed in both private subnets.
- The NAT Gateway allows private workloads to initiate outbound internet connections, for example to fetch external dependencies. It does not allow unsolicited inbound internet traffic.
- This starter configuration uses one NAT Gateway to reduce assignment cost. It creates an Availability Zone dependency and can cause cross-AZ data transfer. For production high availability, use one NAT Gateway per AZ or evaluate VPC endpoints for AWS services such as ECR, SSM and CloudWatch Logs.

## Prerequisites

- Terraform 1.7 or newer
- AWS CLI configured with credentials for the target account
- An AWS identity allowed to create VPC, subnet, route, Internet Gateway, NAT Gateway and Elastic IP resources

## Run locally

From this directory:

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

Copy `terraform.tfvars.example` to `terraform.tfvars` and adjust the region or CIDRs if needed. Do not commit `terraform.tfvars`.

After apply:

```bash
terraform output
```

To remove the networking resources when finished:

```bash
terraform destroy
```

**Cost warning:** NAT Gateway and its Elastic IP/data processing incur charges while provisioned. Run `terraform destroy` when you no longer need the environment, after confirming no other resources depend on it.

## Remote state (S3 with native S3 lockfile)

The backend bucket must exist before Terraform can initialize an S3 backend. Bootstrap it separately (manually or with a small separate Terraform stack). Recommended controls:

1. Create a dedicated S3 bucket in the same or a designated AWS region.
2. Enable bucket versioning and default encryption.
3. Block all public access.
4. Restrict bucket access to the Terraform deployment role.
5. Use native S3 state locking (`use_lockfile = true`), supported by Terraform 1.10+.

After the bucket exists, add this block inside the `terraform` block in `versions.tf`:

```hcl
backend "s3" {
  bucket       = "REPLACE_WITH_YOUR_STATE_BUCKET"
  key          = "devops-api/dev/network/terraform.tfstate"
  region       = "us-east-1"
  encrypt      = true
  use_lockfile = true
}
```

Then migrate the local state:

```bash
terraform init -migrate-state
```

Do not put AWS access keys in this repository. Use an AWS CLI profile locally and GitHub OIDC for GitHub Actions in the pipeline phase.

## Next Terraform phase

Once this networking stack is applied and verified, add:
- ALB, listener, target group and ALB security group
- ECS cluster, task definition and service in the private subnets
- ECR repository and image deployment
- Separate ECS task and task execution IAM roles
- SSM Parameter Store configuration
- CloudWatch log group, alarm and SNS topic

## Notes

This is the networking foundation only. It intentionally does not create the ALB, ECS, IAM, SSM, CloudWatch or SNS resources yet.
