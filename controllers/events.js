const aargh = require('aargh');

const { eventFromModelToObject, eventFromObjectToModel } = require('./mapper');
const { DuplicateEventID } = require('../services/eventServiceErrors');

module.exports = ({ eventsService }) => {
  const getAllEvents = _input => {
    return eventsService
      .getAll()
      .then(events => ({ data: events.map(eventFromModelToObject) }));
  };

  /**
   * Store new event.
   * If new event id exists return 400 error
   *
   */
  const addEvent = input => {
    return eventsService
      .save(eventFromObjectToModel(input.data))
      .then(() => ({ code: 201 }))
      .catch(err =>
        aargh(err)
          .type(DuplicateEventID, () => ({
            code: 400
          }))
          .throw()
      );
  };

  const getByActor = input => {
    return eventsService.getEventsByActor(input.params.actorId).then(events => {
      if (events.length === 0) {
        return { code: 404 };
      } else {
        return { data: events.map(eventFromModelToObject) };
      }
    });
  };

  const eraseEvents = () => {
    return eventsService.eraseAll();
  };

  return {
    getAllEvents: getAllEvents,
    addEvent: addEvent,
    getByActor: getByActor,
    eraseEvents: eraseEvents
  };
};
