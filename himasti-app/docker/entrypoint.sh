#!/bin/sh
set -eu

cd /var/www/html

# Runtime directories may be empty or mounted from persistent storage.
mkdir -p \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Recreate the Laravel public storage link on every container start.
# This remains valid when storage/app/public is mounted as a volume.
if [ -L public/storage ] || [ -e public/storage ]; then
    rm -rf public/storage
fi
ln -s ../storage/app/public public/storage

# Apache/PHP must be able to read existing files and write new uploads.
chown -R www-data:www-data storage bootstrap/cache
find storage bootstrap/cache -type d -exec chmod 755 {} \;
find storage bootstrap/cache -type f -exec chmod 644 {} \;

# Keep database migration under the deployer's control.
# Do not run migrate or migrate:fresh automatically here.
exec docker-php-entrypoint "$@"
