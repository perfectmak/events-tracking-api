const express = require('express');
const { fromControllerAction } = require('./mapper');

module.exports = ({ eventsController }) => {
  const router = express.Router();

  // Routes related to event
  router.delete('/', fromControllerAction(eventsController.eraseEvents));
  return router;
};
