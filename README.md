# Manga Reader
This is a self-hosted manga reader written in Node.js on the backend and Next.js for the frontend. It currently only supports self-hosting, but looks to make it publically available instead.

## Setup

### Prerequisites
* Git
* Node.js
* npm (recommended for most users), yarn or alternative.
* A MongoDB server (using Atlas or any alternative).
* A TMDB API key.
* A Discord Webhook (optional)

### Installation
```shell
git clone https://github.com/Scoutboy06/manga-reader.git
```

Next we need to install the npm packages.

Using npm:
```shell
cd backend
npm install
cd ../client
npm install
```

Using yarn:
```shell
cd backend
yarn install
cd ../client
yarn install
```

## Usage
This project is divided into two parts: the backend (folder `/backend`) and the client (folder `/client`) and needs their own servers.

### Setting up the backend
Create a file called `.env` under `/backend` and fill in these credentials:
```env
PORT = #<A local port, for example 5001>
NODE_ENV = #<'production' or 'development'>
MONGO_URI = #<Your MongoDB connection url>
TMDB_V3_API_KEY = #<Your TMDB API key>
WEBSITE_URI = #<The URI you have for your client>
WEBHOOK_URL = #[The URL endpoint for your Discord Webhook (optional)]
```

### Running the backend
Once you have installed the packages and created the `.env` file, you are ready to start the server.

Using npm:
```shell
cd backend
npm run start
```

Using yarn:
```shell
cd backend
yarn start
```

### Setting up the frontend (website)
Before anything, we need to build the client.

Using npm:
```shell
cd client
npm run build
npm run start
```

Using yarn:
```shell
cd client
yarn build
yarn start
```

## Credits
A lot of inspiration for the website's design was taken from [Jellyfin](https://jellyfin.org/) and [Waifudex](https://waifudex.com/).
