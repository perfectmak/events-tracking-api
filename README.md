# Github Event Tracking API

A REST API built with Node.js to keep track of githhub events, their actors and repositories
and allow querying based on events, actors and their events streaks.

## How to Run
Ensure you have npm(>= 8.14.0) installed, then run:
```
npm start
```

## Database
The codebase use sequelize and defaults to sqlite. You can change the database of choice's configuration inside `dao/index.js` and everything should work as it.