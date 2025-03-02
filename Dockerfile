# Use an official Node.js runtime as a parent image
FROM node:current-alpine

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
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
