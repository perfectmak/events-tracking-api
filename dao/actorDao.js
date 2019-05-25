const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('actor', {
    login: {
      type: Sequelize.STRING,
      allowNull: false
    },
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    eventsCount: {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 1
    },
    latestEventTimestamp: {
      type: Sequelize.DATE,
      allowNull: false
    },
    maximumStreak: {
      type: Sequelize.BIGINT,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
}