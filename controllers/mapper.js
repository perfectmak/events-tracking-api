// Object is from outside and is snakecase, internal model is
// camelCase
const moment = require('moment');

/**
 *
 * @param {*} eventObject
 */
function eventFromObjectToModel(eventObject) {
  const model = {
    id: eventObject.id,
    type: eventObject.type,
    createdAt: moment
      .utc(eventObject.created_at, 'YYYY-MM-DD HH:mm:ss')
      .format()
  };

  if (eventObject.actor) {
    const actor = eventObject.actor;
    model.actorId = actor.id;
    model.actor = actorFromObjectToModel(actor);
  }

  if (eventObject.repo) {
    const repo = eventObject.repo;
    model.repoId = repo.id;
    model.repo = {
      id: repo.id,
      name: repo.name,
      url: repo.url
    };
  }

  return Object.freeze(model);
}

function eventFromModelToObject(eventModel) {
  const object = {
    id: eventModel.id,
    type: eventModel.type,
    created_at: moment.utc(eventModel.createdAt).format('YYYY-MM-DD HH:mm:ss')
  };

  if (eventModel.actor) {
    const actor = eventModel.actor;
    object.actor = actorFromModelToObject(actor);
  }

  if (eventModel.repo) {
    const repo = eventModel.repo;
    object.repo = {
      id: repo.id,
      name: repo.name,
      url: repo.url
    };
  }

  return Object.freeze(object);
}

function actorFromObjectToModel(actorObject) {
  const model = {
    id: actorObject.id,
    login: actorObject.login,
    avatarUrl: actorObject.avatar_url
  };

  return Object.freeze(model);
}

function actorFromModelToObject(actorModel) {
  const object = {
    id: actorModel.id,
    login: actorModel.login,
    avatar_url: actorModel.avatarUrl
  };

  return Object.freeze(object);
}

module.exports = {
  eventFromObjectToModel,
  eventFromModelToObject,
  actorFromObjectToModel,
  actorFromModelToObject
};
