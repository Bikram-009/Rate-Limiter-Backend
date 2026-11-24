# Rate Limiter Project

## Introduction
This project implements a Rate Limiter using Node.js, Express, and Redis.

## Technologies Used
- Node.js
- Express.js
- Redis (Memurai)

## Algorithm
Fixed Window Counter Algorithm

## Configuration
- Request Limit: 5 requests
- Time Window: 60 seconds
- Data Model: Key-Value

## Features
- Tracks incoming client requests.
- Stores request counters in Redis.
- Allows a maximum of 5 requests per minute.
- Rejects additional requests with HTTP 429.
- Automatically expires counters after the time window.

## How to Run

Install dependencies:

npm install

Start the server:

node server.js

Open in browser:

http://localhost:3000/api