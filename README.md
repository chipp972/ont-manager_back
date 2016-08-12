# Stockman API
Restful API for back-end requests for Stockman app
Coded in typescript

valid operations
GET /
GET POST /model
with model in category, order, place, user

GET PUT DELETE /model/id
GET /stock_state/placeId

## deployment

```
mkdir /home/stockman
adduser stockman (answer the questions) | make a script with useradd
chown stockman /home/stockman
chgrp stockman /home/stockman
(ssh-keygen -t rsa)
ssh-copy-id deploy_user@server_address
pm2 deploy ecosystem.json prod setup
pm2 deploy ecosystem.json prod
```

then to update:
```
pm2 deploy ecosystem.json prod update
```
