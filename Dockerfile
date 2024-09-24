# Используем официальный образ PHP с Apache
FROM php:8.1-apache

# Устанавливаем необходимые расширения PHP
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Копируем файлы сайта в директорию Apache
COPY . /var/www/html/

# Устанавливаем права на директорию
RUN chown -R www-data:www-data /var/www/html/