# Use official Python image as base
FROM python:3.10-slim as base

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js (for building React frontend)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# Copy backend requirements and install
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend and model
COPY backend/ backend/

# Copy frontend (src) and root config files
COPY src/ src/
COPY package.json package-lock.json vite.config.ts index.html ./

# Build React frontend
RUN cd src && npm install && npm run build

# Move built frontend to backend/build
RUN mkdir -p backend/build && cp -r src/dist/* backend/build/

# Expose port
EXPOSE 5000

# Start Flask app
CMD ["python", "backend/app.py"] 