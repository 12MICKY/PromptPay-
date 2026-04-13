# PromptPay QR Web App with Docker

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Dockerized](https://img.shields.io/badge/Docker-ready-blue.svg)](./Dockerfile)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-online-brightgreen.svg)](https://promptpay.thiraphat.work)

This project is a static web app designed to be easy to run and deploy with Docker.

The main purpose of this README is to explain Docker clearly:
- what Docker does
- why it is used
- how it is applied in this project

Even though the app itself is a PromptPay QR web app, this document is intentionally Docker-focused.

## Live Demo

You can test the deployed application here:

**https://promptpay.thiraphat.work**

This is a real deployment of the project running on a server through Docker and Cloudflare Tunnel.

## PromptPay References

This project generates PromptPay QR codes, so the overall context of the app is based on official and relevant PromptPay-related sources.

Key points from those references:

- PromptPay is part of Thailand’s digital payment infrastructure.
- It allows money transfers and payments using identifiers such as a mobile phone number or a national ID number.
- PromptPay has also been extended into QR payment and cross-border payment flows.

Primary references:

- Bank of Thailand: PromptPay  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/promptpay.html

- Thai Bankers’ Association: PromptPay service  
  https://www.tba.or.th/pso-tb-cert/pso/pso-service/

- Bank of Thailand: Cross-Border Payment  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/cross-border-payment.html

Notes:

- This README focuses mainly on Docker and deployment.
- The PromptPay section is included to explain the real-world context in which this web app is used.
- For business, legal, or compliance use cases, always verify the latest information directly from official sources.

## What Is Docker?

Docker is a tool for packaging an application and its runtime environment into a portable unit called a `container`.

In simple terms:

- you have application code
- you have the runtime environment
- you may need a web server
- Docker packages them together into an image
- that image can then be run consistently on different machines

Core idea:

- build once
- run anywhere
- reduce “it works on my machine” problems

## Why Use Docker in This Project?

Even though this project is only a static web app, Docker still provides strong practical benefits.

### 1. Easier deployment

Without Docker, you would typically need to:

- install Nginx manually
- configure paths manually
- copy files manually
- manage server configuration manually

With Docker, the workflow becomes:

```bash
docker build -t promptpay-qr-app .
docker run -d -p HOST_PORT:80 promptpay-qr-app
```

That is enough to get the app running.

### 2. Consistent environment

Whether you run the app on:

- a local machine
- a VM
- a dedicated server
- a cloud instance

the result is consistent because the same Docker image is used everywhere.

### 3. Isolation from the host system

The app does not need to mix with the host machine’s packages or web server setup.

For example:

- no need to install Nginx directly on the host
- no need to place files into a shared web root manually
- no need to depend on the host’s application setup

Everything is contained in the container.

### 4. Easier migration

If you need to move this app to another machine, the process is straightforward:

- copy the source code
- build the image
- run the container

### 5. Easier updates

When the web app changes:

- rebuild the image
- remove the old container
- run a new container

This keeps updates predictable and simple.

## What Docker Does in This Project

In this project, Docker is used to:

- package the entire web app
- run Nginx inside the container
- serve static files such as `index.html`, `styles.css`, `app.js`, and related assets

In other words:

Docker is **not** used to generate QR codes.

Docker is used to:

- run the web app
- serve it to users
- make deployment repeatable and clean

## Project Structure

```text
.
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── manifest.json
│   └── sw.js
├── deploy/
│   └── nginx.conf
├── Dockerfile
├── .dockerignore
├── LICENSE
├── SECURITY.md
└── README.md
```

This structure separates responsibilities clearly:

- `public/`
  contains the actual front-end files served by Nginx

- `deploy/`
  contains deployment-related files, especially web server configuration

- project root
  contains top-level project files such as `Dockerfile`, `README.md`, `LICENSE`, and `SECURITY.md`

## Docker-Related Files

### `Dockerfile`

This file tells Docker:

- which base image to use
- which files to copy
- which port the container exposes

### `deploy/nginx.conf`

This is the Nginx configuration used inside the container.

Its role is to:

- receive HTTP requests
- serve the web files
- return `index.html` for the main route

### `.dockerignore`

This file tells Docker which files should not be included in the build context.

Examples:

- `.git`
- logs
- temporary files

Benefits:

- smaller build context
- faster builds
- cleaner images

## Dockerfile Explained

File:

```dockerfile
FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/

EXPOSE 80
```

### `FROM nginx:1.27-alpine`

This uses the official Nginx Alpine image as the base image.

Why this is a good fit:

- lightweight
- fast
- ideal for static sites
- no need to install a web server manually

### `COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf`

This replaces the default Nginx config inside the container with the project’s own config.

That allows the app to be served exactly the way this project expects.

### `COPY public/ /usr/share/nginx/html/`

This copies the static web app files from `public/` into the Nginx web root.

That means Nginx will serve:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `sw.js`

### `EXPOSE 80`

This declares that the container serves traffic on port `80`.

Example:

```bash
docker run -p HOST_PORT:80 promptpay-qr-app
```

Meaning:

- host machine uses `HOST_PORT`
- container uses port `80`

## Nginx Configuration Explained

File:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### `listen 80;`

Nginx listens on port `80` inside the container.

### `root /usr/share/nginx/html;`

This sets the document root for the web app files.

### `index index.html;`

When a user requests `/`, Nginx serves `index.html`.

### `try_files $uri $uri/ /index.html;`

Nginx first tries to find the requested file directly.

If it cannot find one, it falls back to `index.html`.

This is useful for simple single-page-style routing and prevents unnecessary 404 issues.

## `.dockerignore` Explained

Example:

```dockerignore
.git
*.log
*.tmp
```

This prevents unnecessary files from being sent to Docker during build.

Benefits:

- faster build
- cleaner image
- avoids shipping irrelevant local files

## Docker Workflow in This Project

Typical workflow:

1. edit the web files
2. build the Docker image
3. run the container
4. open the app in a browser
5. rebuild and rerun when changes are made

## Build the Docker Image

From the project root:

```bash
docker build -t promptpay-qr-app .
```

Explanation:

- `docker build`
  builds an image

- `-t promptpay-qr-app`
  tags the image with the name `promptpay-qr-app`

- `.`
  uses the current directory as the build context

## Run the Container

```bash
docker run -d --name promptpay-qr-app -p HOST_PORT:80 --restart unless-stopped promptpay-qr-app
```

Explanation:

- `-d`
  runs in detached mode

- `--name promptpay-qr-app`
  assigns a container name

- `-p HOST_PORT:80`
  maps a host port to container port `80`

- `--restart unless-stopped`
  restarts the container automatically unless it is explicitly stopped

- `promptpay-qr-app`
  is the image name to run

## Access the App

If running locally:

```text
http://localhost:HOST_PORT
```

If running on a server:

```text
http://SERVER_IP:HOST_PORT
```

Example:

```text
http://SERVER_IP:HOST_PORT
```

## Run Locally Without Docker

If you just want a quick local test:

```bash
python3 -m http.server -d public 8000
```

Then open:

```text
http://localhost:8000
```

This is convenient for development, but Docker + Nginx is preferred for deployment.

## Useful Docker Commands

### List running containers

```bash
docker ps
```

### List images

```bash
docker images
```

### Stop the container

```bash
docker stop promptpay-qr-app
```

### Start the container again

```bash
docker start promptpay-qr-app
```

### Remove the container

```bash
docker rm -f promptpay-qr-app
```

### Remove the image

```bash
docker rmi promptpay-qr-app
```

## How to Update the Deployment

When the front-end changes:

```bash
docker build -t promptpay-qr-app .
docker rm -f promptpay-qr-app
docker run -d --name promptpay-qr-app -p HOST_PORT:80 --restart unless-stopped promptpay-qr-app
```

This means:

- build a new image
- remove the old container
- run the new container

## Why Not Use Python HTTP Server in Production?

For quick local development, this is fine:

```bash
python3 -m http.server -d public 8000
```

But for production, Docker + Nginx is better because:

- it is more stable
- it is more appropriate for static web serving
- port management is clearer
- automatic restart is easier
- deployment is cleaner and more reproducible

## Real Server Deployment Example

This project has already been deployed to a real server with this flow:

1. copy the project files to the server
2. build the Docker image on the server
3. run the container on a chosen host port
4. point Cloudflare Tunnel or a reverse proxy to `http://SERVER_IP:HOST_PORT`

Example:

```bash
sudo docker build -t promptpay-qr-app .
sudo docker run -d --name promptpay-qr-app -p HOST_PORT:80 --restart unless-stopped promptpay-qr-app
```

## Docker with Cloudflare Tunnel

In this setup:

- Docker runs the app on the server
- Cloudflare Tunnel exposes it safely under a public hostname

Example tunnel config:

```yml
ingress:
  - hostname: your-domain.example
    service: http://SERVER_IP:HOST_PORT
  - service: http_status:404
```

Traffic flow:

```text
User -> your-domain.example -> Cloudflare Tunnel -> Docker Container -> Nginx -> Web App
```

## Benefits of Using Docker Here

- easier setup
- consistent deployment
- cleaner server isolation
- easier migration
- easier updates
- very suitable for static web apps

## Things to Watch Out For

### 1. Docker permissions

On some servers, the normal user may not have permission to access the Docker socket.

In that case, you may need:

```bash
sudo docker ...
```

### 2. Port conflicts

Check whether the target port is already in use before running the container.

### 3. Rebuild required after code changes

If you edit files but do not rebuild the image, the running container will still use the old version.

## Summary

Docker in this project is **not** responsible for generating PromptPay QR codes.

Docker is used to:

- package the app
- run the app
- serve the app through Nginx
- make deployment clean and repeatable

Shortest summary:

> Docker is the packaging and runtime layer that makes this web app easy to deploy consistently on any server.

## Reading Order

If you want to understand the Docker side first:

1. `Dockerfile`
2. `deploy/nginx.conf`
3. `.dockerignore`
4. the build and run commands in this README

If you want to understand the front-end afterward:

1. `public/index.html`
2. `public/styles.css`
3. `public/app.js`

## References

### PromptPay References

- Bank of Thailand: PromptPay  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/promptpay.html

- Thai Bankers’ Association: PromptPay  
  https://www.tba.or.th/pso-tb-cert/pso/pso-service/

- Bank of Thailand: Cross-Border Payment  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/cross-border-payment.html

### Technical References

- Docker Overview  
  https://docs.docker.com/get-started/docker-overview/

- Dockerfile reference  
  https://docs.docker.com/reference/dockerfile/

- Docker build reference  
  https://docs.docker.com/reference/cli/docker/buildx/build/

- Docker run reference  
  https://docs.docker.com/reference/cli/docker/container/run/

- Nginx documentation  
  https://nginx.org/en/docs/

- Cloudflare Tunnel documentation  
  https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

- Cloudflare Tunnel configuration file  
  https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/configuration-file/

### Library References

- `qrcodejs`  
  https://cdnjs.com/libraries/qrcodejs

- `promptpay-qr` by dtinth  
  https://github.com/dtinth/promptpay-qr
