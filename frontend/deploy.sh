#!/bin/bash

# ============================================
# User Management System - Deployment Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}User Management System Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Load environment variables
if [ -f .env.production ]; then
    echo -e "${YELLOW}Loading production environment variables...${NC}"
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env.production file not found!${NC}"
    exit 1
fi

# Check Docker
echo -e "${YELLOW}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Pull latest code
echo -e "${YELLOW}Pulling latest code...${NC}"
git pull origin main

# Stop and remove old containers
echo -e "${YELLOW}Stopping old containers...${NC}"
docker-compose down

# Remove old images
echo -e "${YELLOW}Removing old images...${NC}"
docker system prune -f

# Build new images
echo -e "${YELLOW}Building new images...${NC}"
docker-compose build --no-cache

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check service status
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose ps

# Check logs
echo -e "${YELLOW}Recent logs:${NC}"
docker-compose logs --tail=50

# Health check
echo -e "${YELLOW}Performing health check...${NC}"

# Check backend
if curl -f http://localhost:8080/actuator/health &> /dev/null; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
fi

# Check frontend
if curl -f http://localhost &> /dev/null; then
    echo -e "${GREEN}✓ Frontend is healthy${NC}"
else
    echo -e "${RED}✗ Frontend health check failed${NC}"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Frontend: http://localhost"
echo -e "Backend API: http://localhost:8080"
echo -e "${GREEN}========================================${NC}"