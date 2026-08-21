# basic update
apt update
apt install -y curl

# setup nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
source ~/.bashrc
nvm install 24
nvm alias default 24

# enable pnpm
corepack enable

# install dependencies
pnpm install

# build app
pnpm build

# create logs directory
mkdir apps/server/logs

# copy web ui to serve folder
sudo mkdir -p /var/www/space-scheme
sudo cp -r apps/client/dist/* /var/www/space-scheme/
sudo chown -R www-data:www-data /var/www/space-scheme

# updating web ui code
sudo rm -rf /var/www/space-scheme/*
sudo cp -r apps/client/dist/* /var/www/space-scheme/

# setup nginx
apt install -y nginx
cp scripts/nginx.conf /etc/nginx/sites-available/space-scheme
ln -s /etc/nginx/sites-available/space-scheme /etc/nginx/sites-enabled/space-scheme
systemctl reload nginx

# setup certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d server.space-scheme.online -d space-scheme.online -d www.space-scheme.online

# setup server process
pnpm setup
source ~/.bashrc
pnpm add -g pm2
cd apps/server && pm2 start "pnpm start" --name space-server

# restart server process
pm2 stop space-server
git pull
pnpm install
pnpm build
pm2 start space-server
