# Notification Service

In house service to send notifications

## Pending work

 - Implementation of Delivery status of email through SES
 - Implementation of Delivery status of message through Telegram

## Features

 - No transpilers, just vanilla javascript
 - ES2017 latest features like Async/Await
 - CORS enabled
 - Express + Mongoose ([Mongoose](https://github.com/Automattic/mongoose))
 - Consistent coding styles with [editorconfig](http://editorconfig.org)
 - Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
 - Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
 - Request validation with [celebrate](https://www.npmjs.com/package/celebrate)
 - Gzip compression with [compression](https://github.com/expressjs/compression)
 - Linting with [eslint](http://eslint.org)
 - Logging with [winston](https://github.com/winstonjs/winston)
 - API documentation generator with [apidoc](http://apidocjs.com)

## Requirements

 - [Node v12.15.0+](https://nodejs.org/en/download/current/)

## Getting Started

Clone the repo:

```bash
git clone https://github.com/Rupeekapp/sangraha.git
cd sangraha/NotificationService
```

Install dependencies:

```bash
npm install
```

Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
npm run dev
```

## Documentation

```bash
# generate and open api documentation
npm run docs
```

## Inspirations

 - [KunalKapadia/express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)
 - [diegohaz/rest](https://github.com/diegohaz/rest)

## Start using environment variables  

The menu command File > Preferences > Settings (Code > Preferences > Settings on Mac) provides entry to configure 'user' and 'workspace' settings
Select 'workspace' settings and search for terminal.integrated.env and edit settings.json based on your operating system (like for mac we have to select terminal.integrated.env.osx) and inside "terminal.integrated.env.osx" object we can set the env variables.
