# this will ...
# Use a prebuilt PHP + Apache server (no need to install Apache yourself)
# Copy your backend files into the web root (/var/www/html)
# Install mysqli (needed for MySQL/PHP)
# Enable mod_rewrite (useful if you have .htaccess files for routing)
# Expose port 80 to the host machine

# Use the official PHP-Apache image
FROM php:8.1-apache

# Copy all backend files to the container
COPY . /var/www/html/

# Enable mod_rewrite if you need URL rewriting
RUN docker-php-ext-install mysqli && a2enmod rewrite

# Expose port 80
EXPOSE 80
