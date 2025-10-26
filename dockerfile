FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of project
COPY . .

# Build Next.js
RUN npm run build

# Expose ports for Next.js (3000) and socket server (3001)
EXPOSE 3000 3001

# Start both Next.js and socket server
CMD ["npm", "run", "devStart"]