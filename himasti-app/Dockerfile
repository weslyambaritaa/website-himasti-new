# syntax=docker/dockerfile:1.7

# =========================================================
# 1) PHP runtime base for Laravel + PostgreSQL
#    Extension compilation is limited to one process so the
#    image can also be built on laptops with limited RAM.
# =========================================================
FROM php:8.4-apache AS php-base

ENV DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1 \
    APACHE_DOCUMENT_ROOT=/var/www/html/public \
    MAKEFLAGS=-j1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        unzip \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libpq-dev \
        libxml2-dev \
        libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j1 \
        dom \
        gd \
        opcache \
        pdo_pgsql \
        simplexml \
        xml \
        xmlreader \
        xmlwriter \
        zip \
    && a2enmod rewrite headers expires \
    && sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" \
        /etc/apache2/sites-available/*.conf \
        /etc/apache2/apache2.conf \
        /etc/apache2/conf-available/*.conf \
    && printf '%s\n' \
        '<Directory /var/www/html/public>' \
        '    AllowOverride All' \
        '    Options FollowSymLinks' \
        '    Require all granted' \
        '</Directory>' \
        > /etc/apache2/conf-available/laravel.conf \
    && printf '%s\n' \
        '<Directory /var/www/html/storage/app/public>' \
        '    AllowOverride None' \
        '    Options FollowSymLinks' \
        '    Require all granted' \
        '</Directory>' \
        > /etc/apache2/conf-available/himasti-storage.conf \
    && printf '%s\n' 'ServerName localhost' \
        > /etc/apache2/conf-available/server-name.conf \
    && a2enconf laravel himasti-storage server-name \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# =========================================================
# 2) Install production Composer dependencies
# =========================================================
FROM php-base AS backend-builder

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts \
    --no-autoloader

COPY . .

RUN composer dump-autoload \
    --no-dev \
    --optimize \
    --classmap-authoritative

# =========================================================
# 3) Build React/Inertia/Vite assets
# =========================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=backend-builder /var/www/html ./
RUN npm run build

# =========================================================
# 4) Final production image
# =========================================================
FROM php-base AS runtime

ENV APP_ENV=production \
    APP_DEBUG=false

WORKDIR /var/www/html

COPY --from=backend-builder --chown=www-data:www-data /var/www/html ./
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build ./public/build
COPY docker/entrypoint.sh /usr/local/bin/himasti-entrypoint

RUN chmod +x /usr/local/bin/himasti-entrypoint \
    && mkdir -p \
        storage/app/public \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl --fail --silent http://127.0.0.1/up > /dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/himasti-entrypoint"]
CMD ["apache2-foreground"]
