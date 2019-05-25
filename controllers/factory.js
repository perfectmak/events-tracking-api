const makeEventsController = require('../controllers/events');
const makeActorsController = require('../controllers/actors');
const makeEventsService = require('../services/eventsService');

module.exports = daos => {
  const eventsService = makeEventsService(daos);

  const eventsController = makeEventsController({
    eventsService
  });

  const actorsController = makeActorsController({
    eventsService
  });

  return {
    eventsController,
    actorsController
  };
};
