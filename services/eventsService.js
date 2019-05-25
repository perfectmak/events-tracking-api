const moment = require('moment');
const BigNumber = require('bignumber.js');

const {
  DuplicateEventID,
  RecordNotFound,
  IllegalRecordUpdate
} = require('./eventServiceErrors');

/**
 * Pay no attention to it being called event service
 * Will only do it as events s
 *
 */
module.exports = ({
  eventDao,
  repoDao,
  actorDao,
  withTransaction,
  withRawQuery
}) => {
  const save = async event => {
    // check eventId doesn't exist
    const existingEvent = await eventDao.findOne({ where: { id: event.id } });
    if (existingEvent) {
      throw new DuplicateEventID(event.id);
    }

    await withTransaction(async transaction => {
      await repoDao.upsert(event.repo, { transaction });

      const existingActor = await actorDao.findOne({
        where: { id: event.actor.id }
      });
      if (existingActor) {
        // update eventsCount (atomic would be nice)
        existingActor.eventsCount = new BigNumber(existingActor.eventsCount)
          .plus(1)
          .toString(10);

        const latestEventTimeMoment = moment.utc(
          existingActor.latestEventTimestamp
        );
        const currentEventTimeMoment = moment.utc(event.createdAt);

        // update latest event
        if (currentEventTimeMoment.isAfter(latestEventTimeMoment)) {
          existingActor.latestEventTimestamp = event.createdAt;
        }

        await existingActor.save({ transaction });
      } else {
        // create new Actor with latestEventTimestamp
        await actorDao.create(
          Object.assign({}, event.actor, {
            latestEventTimestamp: event.createdAt
          }),
          { transaction }
        );
      }

      await eventDao.create(event, { transaction });
    });

    // fetch actors events that a within a day apart
    const query = `SELECT DISTINCT e1.*
    FROM events e1
    INNER JOIN events e2 ON e1.actorId = ${event.actor.id}
      AND e1.id <> e2.id
    WHERE ABS(julianday(date(e1.createdAt)) - julianday(date(e2.createdAt))) = 1
    ORDER BY e1.createdAt ASC;`;
    const events = await withRawQuery(query, { type: 'SELECT', model: eventDao });

    // manually count max streak and return
    let currentStreak = 0;
    let maxStreak = 0;
    for (let i = 1; i < events.length; i++) {
      if (
        moment.utc(events[i].createdAt, 'YYYY-MM-DD')
          .diff(moment.utc(events[i - 1].createdAt, 'YYYY-MM-DD'), 'days') === 1
      ) {
        currentStreak++;
      } else {
        // reset current streak
        currentStreak = 0;
      }

      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    }

    if (maxStreak > 0) {
      await actorDao.update(
        {
          maximumStreak: maxStreak
        },
        {
          where: { id: event.actor.id }
        }
      );
    }
  };

  const getAll = () =>
    new Promise((resolve, reject) => {
      return eventDao
        .findAll({
          order: [['id', 'ASC']],
          include: [
            {
              model: actorDao,
              required: false,
              as: 'actor'
            },
            {
              model: repoDao,
              required: false,
              as: 'repo'
            }
          ]
        })
        .then(resolve)
        .catch(reject);
    });

  const getAllActors = async () => {
    return actorDao.findAll({
      order: [['eventsCount', 'DESC'], ['latestEventTimestamp', 'DESC']]
    });
  };

  const getAllActorByStreak = async () => {
    return actorDao.findAll({
      order: [
        ['maximumStreak', 'DESC'],
        ['latestEventTimestamp', 'DESC'],
        ['login', 'ASC']
      ]
    });
  };

  const getEventsByActor = actorId =>
    new Promise((resolve, reject) => {
      return eventDao
        .findAll({
          where: { actorId },
          order: [['id', 'ASC']],
          include: [
            {
              model: actorDao,
              required: false,
              as: 'actor'
            },
            {
              model: repoDao,
              required: false,
              as: 'repo'
            }
          ]
        })
        .then(resolve)
        .catch(reject);
    });

  const updateActor = async actor => {
    const existingActor = await actorDao.findOne({ where: { id: actor.id } });
    if (!existingActor) {
      throw new RecordNotFound(`Actor with id [${actor.id}] does not exist.`);
    }

    if (existingActor.login !== actor.login) {
      throw new IllegalRecordUpdate(
        `Cannot update login for actor [${actor.id}].`
      );
    }

    existingActor.avatarUrl = actor.avatarUrl;
    await existingActor.save();
  };

  const eraseAll = () =>
    new Promise((resolve, reject) => {
      eventDao
        .destroy({ truncate: true })
        .then(() => repoDao.destroy({ truncate: true }))
        .then(() => actorDao.destroy({ truncate: true }))
        .then(resolve)
        .catch(reject);
    });

  return {
    save,
    getAll,
    getEventsByActor,
    updateActor,
    getAllActors,
    getAllActorByStreak,
    eraseAll
  };
};
