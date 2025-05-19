# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy source files and install dependencies
COPY . .
RUN npm install

# Build the app
RUN npm run build

# Add the _redirects file to the build output
COPY public/_redirects build/_redirects

# Serve with static server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000