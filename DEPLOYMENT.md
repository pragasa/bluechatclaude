# BlueChat Deployment Guide

Complete production deployment instructions for BlueChat on various platforms.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Docker Compose (Recommended)](#docker-compose)
3. [AWS EC2 Deployment](#aws-ec2)
4. [Heroku Deployment](#heroku)
5. [DigitalOcean App Platform](#digitalocean)
6. [Self-Hosted (VPS)](#self-hosted)
7. [Production Checklist](#production-checklist)

---

## Prerequisites

- Domain name (e.g., bluechat.example.com)
- SSL certificate (via Let's Encrypt)
- SMTP credentials (Gmail, SendGrid, etc.)
- AWS S3 account (for file storage) - optional
- MongoDB Atlas account or self-hosted MongoDB

---

## Docker Compose (Recommended)

The fastest way to deploy BlueChat locally or on any server with Docker.

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/bluechat.git
cd bluechat-monorepo
```

### Step 2: Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
nano backend/.env
```

### Step 3: Build and Run
```bash
docker-compose up -d
```

### Step 4: Verify Services
```bash
docker-compose ps
docker-compose logs -f backend
```

### Step 5: Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Stop Services
```bash
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## AWS EC2 Deployment

### Step 1: Launch EC2 Instance

```bash
# Use Ubuntu 22.04 LTS AMI
# Instance type: t3.medium (minimum)
# Security groups: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

### Step 2: SSH into Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for frontend build)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y
```

### Step 4: Configure Domain & SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### Step 5: Deploy BlueChat

```bash
git clone https://github.com/yourusername/bluechat.git
cd bluechat-monorepo

# Configure environment
cp backend/.env.example backend/.env
nano backend/.env
# Add your production credentials

# Start services
docker-compose -f docker-compose.yml up -d
```

### Step 6: Configure Nginx

Create `/etc/nginx/sites-available/bluechat`:

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://backend/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/bluechat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Heroku Deployment

### Step 1: Create Heroku App

```bash
heroku login
heroku create bluechat-app
```

### Step 2: Add Buildpacks

```bash
heroku buildpacks:add heroku/nodejs -a bluechat-app
heroku buildpacks:add https://github.com/chris-bk/heroku-buildpack-vite.git -a bluechat-app
```

### Step 3: Add MongoDB

```bash
# Using MongoDB Atlas
heroku config:set DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/bluechat -a bluechat-app
```

### Step 4: Set Environment Variables

```bash
heroku config:set JWT_SECRET=your_secret_key -a bluechat-app
heroku config:set FRONTEND_URL=https://bluechat-app.herokuapp.com -a bluechat-app
heroku config:set NODE_ENV=production -a bluechat-app
# Add other environment variables...
```

### Step 5: Deploy

```bash
git push heroku main
```

### Monitor Logs

```bash
heroku logs --tail -a bluechat-app
```

---

## DigitalOcean App Platform

### Step 1: Connect Repository

1. Go to DigitalOcean App Platform
2. Click "Create" → "App"
3. Select your GitHub repository
4. DigitalOcean auto-detects Node.js and creates components

### Step 2: Configure Services

Create `app.yaml`:

```yaml
name: bluechat
services:
- name: backend
  github:
    branch: main
    repo: yourusername/bluechat
  source_dir: backend
  build_command: npm install && npm run build
  run_command: npm start
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    scope: RUN_TIME
  http_port: 3000
  health_check:
    http_path: /health
  
- name: frontend
  github:
    branch: main
    repo: yourusername/bluechat
  source_dir: frontend
  build_command: npm install && npm run build
  run_command: npm run preview
  envs:
  - key: VITE_API_URL
    value: ${backend.PUBLIC_URL}/api/v1
  http_port: 5173

databases:
- name: mongodb
  engine: MONGODB
  version: "7.0"
  production: true
```

---

## Self-Hosted (VPS)

### Using systemd

Create `/etc/systemd/system/bluechat-backend.service`:

```ini
[Unit]
Description=BlueChat Backend
After=network.target mongodb.service redis.service

[Service]
Type=simple
User=bluechat
WorkingDirectory=/home/bluechat/app
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable bluechat-backend.service
sudo systemctl start bluechat-backend.service
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name bluechat-backend

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor
pm2 monit
```

---

## Production Checklist

- [ ] Update `JWT_SECRET` and all secrets with strong random values
- [ ] Configure `FRONTEND_URL` and `BACKEND_URL` correctly
- [ ] Set `NODE_ENV=production`
- [ ] Enable SSL/HTTPS on Nginx
- [ ] Configure MongoDB backups
- [ ] Set up monitoring (Datadog, New Relic, etc.)
- [ ] Configure email service (SMTP)
- [ ] Set up AWS S3 for file storage
- [ ] Configure rate limiting
- [ ] Enable CORS only for your domain
- [ ] Set up error tracking (Sentry)
- [ ] Configure log aggregation (ELK Stack, Papertrail)
- [ ] Set up health check monitoring
- [ ] Configure auto-scaling policies
- [ ] Test database failover
- [ ] Perform load testing
- [ ] Set up CI/CD pipeline
- [ ] Document runbooks for incidents
- [ ] Configure backup/restore procedures

---

## Monitoring & Logging

### PM2 Plus
```bash
pm2 plus  # Connect to monitoring dashboard
```

### Docker Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### MongoDB Monitoring
```bash
mongosh mongodb://admin:password@localhost:27017
> db.serverStatus()
```

---

## Scaling Recommendations

**Small deployment (< 1K users):**
- Single EC2 t3.medium instance
- MongoDB Atlas shared cluster
- Single backend instance

**Medium deployment (1K - 50K users):**
- EC2 t3.large with autoscaling
- MongoDB Atlas M10+ cluster
- 2-3 backend instances behind load balancer

**Large deployment (50K+ users):**
- ECS cluster with autoscaling
- MongoDB enterprise cluster
- 5+ backend instances
- Redis cluster for caching
- CloudFront for CDN

---

## Troubleshooting

### Containers won't start
```bash
docker-compose logs
docker-compose ps
docker-compose down -v && docker-compose up -d
```

### Database connection errors
```bash
# Test MongoDB connection
mongosh mongodb://user:password@host:27017/bluechat
```

### WebSocket connection issues
- Check Nginx WebSocket proxy settings
- Verify firewall allows WebSocket traffic
- Check browser console for errors

### High CPU usage
```bash
docker stats
pm2 monit
# Scale horizontally if needed
```

---

For more help, see the main [README.md](./README.md) or open an issue on GitHub.
