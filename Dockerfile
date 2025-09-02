# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Create clean package.json for production (without devDependencies and dev scripts) before copying other files
RUN node -e "const pkg = require('./package.json'); delete pkg.devDependencies; pkg.scripts = {start: pkg.scripts.start}; require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));" \
    && rm -f package-lock.json

# Copy application code
COPY index.js ./

# Remove npm (runtime doesn't need npm, only node)
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx || true

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]