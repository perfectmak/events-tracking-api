const aargh = require('aargh');

const {
  RecordNotFound,
  IllegalRecordUpdate
} = require('../services/eventServiceErrors');
const { actorFromModelToObject, actorFromObjectToModel } = require('./mapper');

module.exports = ({ eventsService }) => {
  const getAllActors = _input => {
    return eventsService
      .getAllActors()
      .then(actors => ({ data: actors.map(actorFromModelToObject) }));
  };

  const updateActor = input => {
    return eventsService
      .updateActor(actorFromObjectToModel(input.data))
      .then(() => ({ code: 200 }))
      .catch(err =>
        aargh(err)
          .type(RecordNotFound, () => ({ code: 404 }))
          .type(IllegalRecordUpdate, () => ({ code: 400 }))
          .throw()
      );
  };

  const getStreak = () => {
    return eventsService
      .getAllActorByStreak()
      .then(actors => ({ data: actors.map(actorFromModelToObject) }));
  };

  return {
    updateActor: updateActor,
    getAllActors: getAllActors,
    getStreak: getStreak
  };
};
