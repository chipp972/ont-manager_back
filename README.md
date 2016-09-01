# Stockman API

Require node v6+

Restful API for back-end requests for Stockman app
Coded in typescript

valid operations
GET /
GET POST /model
with model in category, order, place, user

GET PUT DELETE /model/id
GET /stock_state/placeId

## authentication ##

*   A user must first register doing a "post" on '/register' with email and password
*   Then waits for someone to activate his account
*   Then to navigate on the api this user must first authenticate sending a
    request "post" on '/authenticate'. He will then receive a token.
    The token must be passed in the header in the field 'token' to authenticate
    this user for each request.
*   The token is valid 1h
Note: the user informations is in request.user in each authenticated requests.

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
