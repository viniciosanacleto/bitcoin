# Requirements
- Node >= v20.17.0
- RabbitMQ
- Sendgrid account (https://sendgrid.com) for emails
- PostgreSQL

# Installation

### Packages
First of all run the packages install
```
$ npm install
or
$ yarn install
```

### Environment variables
After you should set the `.env` file. You can copy from `.env.example` or from here:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
JWT_SECRET="YOUR_SECRET"
SENDGRID_API_KEY="YOUR_SENDGRID_KEY"
SENDGRID_SENDER="name@mail.com"
MESSAGING_URL="amqp://localhost"
```

`DATABASE_URL` => Should contain the information to connect in your PostgreSQL database. Replace the `USER`, `PASSWORD` and `DATABASE_NAME` with your local configs. If you run a non default configuration of PostgreSQL maybe is necessary to change the host and port too.

`JWT_SECRET` => Any random string will work. I seriously recommend something strong.

`SENDGRID_API_KEY` => Your Sendgrid API key should be generated in your account via Sendgrid website.https://app.sendgrid.com/settings/api_keys

`SENDGRID_SENDER` => Sendgrid sender is the email previously authorized in the Sendgrid settings. Is the email address that sign the email. Can be modified here: https://app.sendgrid.com/settings/sender_auth

`MESSAGING_URL` => Is the connection URL to your messaging system. In this case I highly recommend RabbitMQ.

# Running
```
$ npm run dev
or
$ yarn dev
```
The API server will start running in the port 3000.

# Using
The endpoints implemented are available as a Postman collection to be imported in file `api.postman.json`

All the endpoints are authenticated, except `POST /account` and `POST /login`, so remember to set your environment variable `token` in your Postman or pass the `Authorization` header as `Bearer YOUR_TOKEN`.