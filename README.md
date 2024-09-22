# Requirements
- Node >= v20.17.0
- Sendgrid account (https://sendgrid.com) for emails
- PostgreSQL
- RabbitMQ (optional)

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

`MESSAGING_URL` (optional) => Is the connection URL to your messaging system. In this case I highly recommend RabbitMQ. **OBS**: The messaging system is used to queue the emails and process them after. If this setting is not set or fail, the email will be sent during runtime as fallback.

### Migrations

Run the DB migrations using the command:
```
$ npx prisma migrate deploy
```

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

### Crons

There are two crons used to save and delete BTC prices.
You can set this crons in your system or for test pourpose simply run them manually.
```
// Save the last BTC price from Mercado Bitcoin
$ npx ts-node src/cmd/crons/update-btc-price.ts

// Delete BTC price registers older than 90 days
$ npx ts-node src/cmd/crons/delete-old-prices.ts
```

### Queue Processors

To run the email queue processor run the command:
```
npx ts-node src/cmd/crons/process-emails.ts
```