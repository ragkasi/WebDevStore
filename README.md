# FEH Robot Store

This is a monorepo for the Node.js-based FEH robot store. The web development team is working to develop this store to allow both honors and non-honors students to access robotic parts and purchase them.

## Repository Structure

Packages are accessible in the packages/ directory. The packages are:

- `api` - The backend node.js application that runs in a Docker environment in production
- `web` - The frontend Vue single-page application (omitted for application)
- `components` - The frontend Vue single-page application that allows users to change or update object attributes
- `shared` - The backend protocols designed to track user roles and standard responses
- `views` - The frontend Vue single-page application that tracks objects and communicates with backend protocols

Documentation for each package is available in the README.md file within each package.

## Coding Environment

If you use the Visual Studio Code IDE, you can benefit from the code workspace included at the root of this repository.

## Branch Structure

- omitted for application

## Required Software

- [Node.js v16+](https://nodejs.org/en/download/current/)
- [Docker Community Edition](https://docs.docker.com/get-docker/); if using Windows, install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10#manual-installation-steps)
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli?in=terraform/aws-get-started)

On Windows, you can use [Chocolatey](https://chocolatey.org/install) to install all of the programs except [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10#manual-installation-steps) by running `choco install nodejs docker-desktop awscli terraform` in Administrative PowerShell (right-click, "Run As Administrator").
