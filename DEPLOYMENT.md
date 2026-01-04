# Deployment Guide

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Environment variables configured

### Docker Compose File Structure

This project uses different Docker Compose files for different purposes:

- **`docker-compose.yml`**: Main configuration for local development (corporate environment by default)
- **`docker-compose.override.yml`**: Local development overrides of the main `docker-compose.yml` (auto-merged when present)
- **`docker-compose.prod.yml`**: Standalone configuration for cloud/production deployments

**Key distinction:**
- `docker-compose.prod.yml` is designed to be **standalone** for cloud deployments
- `docker-compose.override.yml` is for **local development overrides** of the main `docker-compose.yml`

### Corporate Proxy / SSL Certificate Setup

This application supports running behind corporate SSL inspection proxies (like Zscaler) without baking certificates into the Docker image.

#### On Corporate Laptop (with Zscaler/SSL Inspection)

The default `docker-compose.yml` is configured for corporate environments:

```bash
# Default configuration mounts certificate at runtime
docker compose up --build
```

This configuration:
- Sets `DISABLE_SSL_CHECK=true` during build (for npm install)
- Mounts your Zscaler certificate from `~/zscalar/ZscalerRootCertificate-2048-SHA256.crt`
- Sets `NODE_EXTRA_CA_CERTS` to use the mounted certificate

**Customize certificate path:**
```bash
# Edit .env file to set your certificate location
SSL_CERT_FILE=/path/to/your/certificate.crt
```

#### On Clean Environments (No Proxy)

For non-corporate environments, use the override file:

```bash
# Copy the override configuration
cp docker-compose.override.yml.example docker-compose.override.yml

# Docker Compose automatically merges both files
docker compose up --build
```

Or explicitly specify which compose files to use:
```bash
# Clean environment
docker compose -f docker-compose.yml -f docker-compose.override.yml.example up --build
```

The override removes:
- SSL certificate volume mount
- `NODE_EXTRA_CA_CERTS` environment variable
- Sets `DISABLE_SSL_CHECK=false`

#### Direct Docker Build (No Compose)

**Corporate environment:**
```bash
# Build with SSL check disabled
docker build --build-arg DISABLE_SSL_CHECK=true -t finance-aggregator .

# Run with certificate mounted
docker run -d \
  -p 3000:3000 \
  -v ~/zscalar/ZscalerRootCertificate-2048-SHA256.crt:/etc/ssl/certs/custom-ca.crt:ro \
  -e NODE_ENV=production \
  -e NODE_EXTRA_CA_CERTS=/etc/ssl/certs/custom-ca.crt \
  -e TRADING212_STOCKS_ISA_API_KEY=your_key \
  -e TRADING212_STOCKS_ISA_SECRET_KEY=your_secret \
  --name finance-aggregator \
  finance-aggregator
```

**Clean environment:**
```bash
# Build without SSL workarounds
docker build --build-arg DISABLE_SSL_CHECK=false -t finance-aggregator .

# Run without certificate mount
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e TRADING212_STOCKS_ISA_API_KEY=your_key \
  -e TRADING212_STOCKS_ISA_SECRET_KEY=your_secret \
  --name finance-aggregator \
  finance-aggregator
```

### Local Development

1. **Create environment file:**
   ```bash
   cp .env.template .env
   # Edit .env with your actual API keys and SSL_CERT_FILE if needed
   ```

2. **Run with Docker Compose:**
   ```bash
   docker compose up --build
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/balance
   ```

### Common Docker Commands

**Rebuild without cache:**
```bash
# Build without cache
docker compose build --no-cache

# Then start the containers
docker compose up

# Or do both in one command
docker compose up --build --force-recreate

# For a complete rebuild (stop, remove, rebuild, start)
docker compose down && docker compose build --no-cache && docker compose up -d
```

**Run in background (detached mode):**
```bash
docker compose up -d
```

**Stop containers:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f
```

### Production Deployment

#### Option 1: Using .env file (Simple)
```bash
# Ensure .env exists with production values
docker-compose up -d --build
```

#### Option 2: Direct environment variables (Recommended)
```bash
docker build -t finance-aggregator .
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e TRADING212_STOCKS_ISA_API_KEY=your_key \
  -e TRADING212_STOCKS_ISA_SECRET_KEY=your_secret \
  --name finance-aggregator \
  --restart unless-stopped \
  finance-aggregator
```

#### Option 3: Docker Swarm / Kubernetes Secrets
```bash
# Create Docker secret
echo "your_api_key" | docker secret create trading212_api_key -
echo "your_secret" | docker secret create trading212_secret_key -

# Use in docker-compose with secrets
# See docker-compose.prod.yml example
```

### Cloud Deployment

#### AWS ECS
1. Store secrets in **AWS Secrets Manager**
2. Reference in ECS task definition:
   ```json
   "secrets": [
     {
       "name": "TRADING212_STOCKS_ISA_API_KEY",
       "valueFrom": "arn:aws:secretsmanager:region:account:secret:name"
     }
   ]
   ```

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name finance-aggregator \
  --image myregistry.azurecr.io/finance-aggregator \
  --environment-variables \
    NODE_ENV=production \
    PORT=3000 \
  --secure-environment-variables \
    TRADING212_STOCKS_ISA_API_KEY=$API_KEY \
    TRADING212_STOCKS_ISA_SECRET_KEY=$SECRET_KEY
```

#### Google Cloud Run
```bash
gcloud run deploy finance-aggregator \
  --image gcr.io/project/finance-aggregator \
  --set-env-vars NODE_ENV=production,PORT=3000 \
  --set-secrets TRADING212_STOCKS_ISA_API_KEY=trading212-api-key:latest \
  --set-secrets TRADING212_STOCKS_ISA_SECRET_KEY=trading212-secret:latest
```

### Health Checks

The Docker image includes a health check endpoint:
```bash
# Check container health
docker ps

# Manual health check
curl http://localhost:3000/health
```

### Security Best Practices

✅ **DO:**
- Use Docker secrets or cloud provider secret managers
- Set environment variables at runtime, not build time
- Use `.env.template` for documentation
- Rotate API keys regularly
- Run containers as non-root user (already configured)
- Mount SSL certificates at runtime (don't bake into image)
- Use `docker-compose.override.yml` for environment-specific configurations

❌ **DON'T:**
- Commit `.env` files to Git
- Hard-code secrets in Dockerfile
- Use `ARG` for secrets (they're visible in image history)
- Expose unnecessary ports
- Bake corporate SSL certificates into Docker images
- Commit `docker-compose.override.yml` to Git (add to `.gitignore`)

### Troubleshooting

**Check logs:**
```bash
docker-compose logs -f
# or
docker logs -f finance-aggregator
```

**Verify environment variables:**
```bash
docker exec finance-aggregator env | grep TRADING212
```

**SSL Certificate Issues:**
```bash
# Check if certificate is mounted correctly
docker exec finance-aggregator ls -la /etc/ssl/certs/custom-ca.crt

# Verify NODE_EXTRA_CA_CERTS is set
docker exec finance-aggregator env | grep NODE_EXTRA_CA_CERTS

# Test SSL connectivity from inside container
docker exec finance-aggregator wget -O- https://live.trading212.com
```

**Certificate not found error:**
If you see "unable to get local issuer certificate":
1. Verify certificate path exists on host: `ls -la ~/zscalar/ZscalerRootCertificate-2048-SHA256.crt`
2. Check volume mount in `docker-compose.yml`
3. Ensure `NODE_EXTRA_CA_CERTS` environment variable is set
4. Try rebuilding with `--no-cache`: `docker compose build --no-cache`

**npm install fails during build:**
- Corporate environment: Ensure `DISABLE_SSL_CHECK=true` in build args
- Clean environment: Ensure `DISABLE_SSL_CHECK=false` in build args

**Enter container for debugging:**
```bash
docker exec -it finance-aggregator sh
```

### CI/CD Integration

Example GitHub Actions workflow:
```yaml
- name: Build and push Docker image
  run: |
    docker build -t myregistry/finance-aggregator:${{ github.sha }} .
    docker push myregistry/finance-aggregator:${{ github.sha }}

- name: Deploy to production
  run: |
    docker run -d \
      -e TRADING212_STOCKS_ISA_API_KEY=${{ secrets.TRADING212_API_KEY }} \
      -e TRADING212_STOCKS_ISA_SECRET_KEY=${{ secrets.TRADING212_SECRET_KEY }} \
      myregistry/finance-aggregator:${{ github.sha }}
```
