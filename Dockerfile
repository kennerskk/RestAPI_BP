FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code explicitly
COPY server.js ./
COPY models ./models
COPY routes ./routes
COPY frontend ./frontend

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]