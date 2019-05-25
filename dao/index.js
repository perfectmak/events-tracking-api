var Sequelize = require('sequelize');

var makeEventDao = require('./eventDao');
var makeRepoDao = require('./repoDao');
var makeActorDao = require('./actorDao');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite3'
});

// TODO: Test sequelize.connection() and log error

const eventDao = makeEventDao(sequelize);
const repoDao = makeRepoDao(sequelize);
const actorDao = makeActorDao(sequelize);

// setup relationships
eventDao.belongsTo(repoDao);
eventDao.belongsTo(actorDao);
repoDao.hasMany(eventDao);
actorDao.hasMany(eventDao);

let _isReady = false

module.exports = {
  eventDao,
  repoDao,
  actorDao,
  withTransaction: (callback) => {
    return sequelize.transaction(callback)
  },
  withRawQuery: (query, options) => {
    return sequelize.query(query, options)
  },
  sync: () => sequelize.sync()
    .then(args => {
      _isReady = true;
      return args
    }),
  isReady: () => _isReady
};
