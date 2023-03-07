const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

// const dayjs = require('dayjs');

const { HttpError } = require('../models/http-error');

const Ticket = require('../models/ticket');
const Engineer = require('../models/engineer');

exports.addTicket = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(HttpError);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { administration, sector, repairType, time, userId, engineerId } =
    req.body;

  const newTicket = new Ticket({
    userId,
    engineerId,
    administration,
    sector,
    repairType,
    time,
  });

  console.log(newTicket);

  try {
    await newTicket.save();
  } catch (err) {
    const error = new HttpError(
      'Creating Ticket failed, please try again.',
      500
    );
    return next(error);
  }

  let loadedEngineer;
  try {
    loadedEngineer = await Engineer.findById(engineerId);
  } catch (err) {
    const error = new HttpError(
      'Finding Engineer failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!loadedEngineer) {
    const error = new HttpError('No Such Engineer.', 404);
    return next(error);
  }

  res.status(201).json({
    message: 'Ticket created!',
    ticketId: newTicket._id,
    engineerName: `${loadedEngineer.firstName} ${loadedEngineer.secondName}`,
  });
};
