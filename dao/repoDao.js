const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('repo', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });
}