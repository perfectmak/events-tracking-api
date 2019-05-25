const express = require('express');
const { fromControllerAction } = require('./mapper');

module.exports = ({ actorsController }) => {
  const router = express.Router();

  // Routes related to event
  router.get('/', fromControllerAction(actorsController.getAllActors));
  router.put('/', fromControllerAction(actorsController.updateActor));
  router.get('/streak', fromControllerAction(actorsController.getStreak));
  return router;
};
