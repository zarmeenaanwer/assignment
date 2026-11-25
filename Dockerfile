
# Use lightweight Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY src/ ./src/

# Run as non-root user
USER node

# Expose application port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
