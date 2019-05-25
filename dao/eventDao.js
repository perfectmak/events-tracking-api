const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('event', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    timestamps: false
  });
}