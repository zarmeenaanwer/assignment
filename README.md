# AWS ECS Fargate Deployment with Terraform & GitHub Actions

## Project Overview

This project demonstrates an end-to-end DevOps deployment workflow for a Node.js Express application using AWS services, Terraform, Docker, Amazon ECR, and GitHub Actions.

The infrastructure is provisioned using Terraform, while the application build and deployment process is automated through GitHub Actions.

The project also includes deployment and rollback workflows to demonstrate application version management and recovery.

## Architecture & Technologies

| Component | Technology |
|---|---|
| Cloud Provider | AWS |
| Infrastructure as Code | Terraform |
| Containerization | Docker |
| Container Registry | Amazon ECR |
| Container Orchestration | Amazon ECS Fargate |
| CI/CD | GitHub Actions |
| Authentication | AWS IAM OIDC |
| Application | Node.js & Express |
| Deployment Configuration | YAML & JSON |

## Infrastructure (Terraform)

AWS infrastructure is configured using Terraform to make resource provisioning repeatable and manageable.

Infrastructure setup covers the AWS resources required to run and deploy the application, including:

- VPC and networking configuration
- Subnets and network connectivity
- Security groups and access control
- ECS Fargate infrastructure
- Supporting AWS resources required for deployment

Terraform helps maintain infrastructure as code and provides a consistent deployment environment.

## Application

The project uses a Node.js application built with Express.js.

**Application details:**
- Runtime: Node.js 22
- Framework: Express.js
- Container Port: 3000
- Containerization: Docker

The application is packaged into a Docker image and deployed as an ECS Fargate task.

## Amazon ECS Fargate

Amazon ECS Fargate is used to run the containerized application without managing EC2 instances.

The deployment configuration includes:

- ECS Task Definition
- Fargate launch compatibility
- Container configuration
- CPU and memory allocation
- IAM Task Execution Role
- Container port mapping

Amazon ECR stores the Docker images used by ECS during deployment.

## CI/CD Pipeline – GitHub Actions

The CI/CD pipeline automates the application build and deployment process.

GitHub Actions uses AWS IAM OIDC authentication to securely access AWS without storing long-lived AWS access keys in GitHub.

### Deployment Workflow

1. **Code Push:** A developer pushes application changes to the `main` branch.
2. **GitHub Actions:** The deployment workflow is triggered automatically.
3. **AWS Authentication:** GitHub Actions assumes the AWS IAM deployment role using OIDC.
4. **ECR Setup:** The workflow checks for the required ECR repository and creates it if necessary.
5. **Docker Build:** The application Docker image is built.
6. **Image Versioning:** A version tag is assigned to the Docker image.
7. **ECR Push:** The Docker image is pushed to Amazon ECR.
8. **Task Definition Update:** The ECS task definition is updated with the new image.
9. **ECS Deployment:** The updated task definition is deployed to the ECS service.
10. **Deployment Verification:** GitHub Actions waits for the ECS service to reach a stable state.

### Overall CI/CD Flow

```text
Developer
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    v
AWS OIDC Authentication
    |
    v
Docker Build
    |
    v
Amazon ECR
    |
    v
Update ECS Task Definition
    |
    v
Amazon ECS Fargate
    |
    v
Application Deployment
```

## Deployment & Rollback Workflows

The project includes separate GitHub Actions workflows for deployment and rollback.

### 1. deploy.yml

Automates the complete deployment process:

- Builds the Docker image.
- Pushes the image to Amazon ECR.
- Updates the ECS task definition.
- Deploys the new application version.
- Waits for deployment stability.

### 2. rollback.yml

Provides a rollback workflow to restore a previous ECS task definition revision when a deployment needs to be reverted.

This helps demonstrate version recovery and deployment management.

## Repository Structure

```text
devops-assignment/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       ├── deployment.yaml
│       └── rollback.yml
│
├── src/
│   └── server.js
│
├── Dockerfile
├── package.json
├── package-lock.json
├── ecs-task-definition.json
└── README.md
```

Terraform configuration files should also be included in the repository or linked separately if maintained in a separate infrastructure repository.

## Prerequisites

Before running the deployment pipeline, the following are required:

- AWS account with the necessary ECS, ECR, IAM, and networking permissions.
- Terraform installed.
- Docker installed.
- GitHub repository.
- AWS IAM OIDC Identity Provider.
- GitHub deployment IAM role with the required permissions.
- ECS Task Execution Role.
- ECS Cluster and ECS Service.
- Required GitHub Actions variables and secrets.

### GitHub Repository Configuration

Configure the following repository variables under:

`Settings → Secrets and variables → Actions → Variables`

| Variable | Description |
|---|---|
| AWS_REGION | AWS deployment region |
| ECR_REPOSITORY | Amazon ECR repository name |
| ECS_CLUSTER | ECS cluster name |
| ECS_SERVICE | ECS service name |
| CONTAINER_NAME | ECS container name |

Configure this repository secret:

| Secret | Description |
|---|---|
| AWS_ROLE_ARN | AWS IAM deployment role ARN |

## How to Deploy

Push changes to the `main` branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

GitHub Actions automatically triggers the deployment workflow.

You can monitor the deployment under:

`GitHub Repository → Actions → Build and Deploy to ECS Fargate`

Manual deployment can also be triggered using the `workflow_dispatch` option when configured in the workflow.

## Project Objectives

- Automate AWS infrastructure provisioning using Terraform.
- Containerize applications using Docker.
- Deploy containerized applications using Amazon ECS Fargate.
- Automate CI/CD using GitHub Actions.
- Implement secure AWS authentication using OIDC.
- Manage Docker images using Amazon ECR.
- Implement deployment versioning and rollback.
- Demonstrate an end-to-end AWS DevOps workflow.

## Conclusion

This project demonstrates an automated AWS deployment workflow combining Infrastructure as Code, containerization, cloud infrastructure, and CI/CD automation.
