const { mongo, deleteModel } = require('mongoose');
const models = require('../models');

const { Stop } = models;

const makerPage = (req, res) => {
  Stop.StopModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeStop = (req, res) => {
  if (!req.body.name || !req.body.address || !req.body.dispatch) {
    return res.status(400).json({ error: 'STOP! Name, age and level are required' });
  }

  const stopData = {
    name: req.body.name,
    address: req.body.address,
    dispatch: req.body.dispatch,
    owner: req.session.account._id,
  };

  const newStop = new Stop.StopModel(stopData);

  const stopPromise = newStop.save();

  stopPromise.then(() => res.json({ redirect: '/maker' }));

  stopPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Stop already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return stopPromise;
};

const getStops = (request, response) => {
  const req = request;
  const res = response;

  return Stop.StopModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ stops: docs });
  });
};

const deleteStop = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.body);

  return Stop.StopModel.removeStop(req.body.stopId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ redirect: '/maker' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getStops = getStops;
module.exports.deleteStop = deleteStop;
module.exports.make = makeStop;
