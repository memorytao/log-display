# Use an official Node.js runtime as a parent image
FROM node:current-alpine AS builder

# Set the working directory
WORKDIR /gui_app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
# EXPOSE 3000

# Define the command to run the app
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# Use an official nginx image
FROM nginx:alpine

# Copy the build files to nginx's default public folder
COPY --from=builder /gui_app/dist /usr/share/nginx/html
COPY dist/ /usr/share/nginx/html

# Optional: copy your custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]