const express = require('express');
const { fromControllerAction } = require('./mapper');

module.exports = ({ eventsController }) => {
  const router = express.Router();

  // Routes related to event
  router.post('/', fromControllerAction(eventsController.addEvent));
  router.get('/', fromControllerAction(eventsController.getAllEvents));
  router.get(
    '/actors/:actorId',
    fromControllerAction(eventsController.getByActor)
  );
  return router;
};
