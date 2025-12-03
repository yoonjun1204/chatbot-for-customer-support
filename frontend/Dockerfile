# frontend/Dockerfile

########################
# Build stage
########################
FROM node:20 AS build

WORKDIR /app

# Copy dependency files (this handles package.json and package-lock.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build-time environment variables for Vite
ARG VITE_API_BASE_URL
ARG VITE_RASA_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RASA_BASE_URL=$VITE_RASA_BASE_URL

# Build the production bundle
RUN npm run build

########################
# Serve stage
########################
FROM nginx:1.27-alpine

# Copy built assets to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
