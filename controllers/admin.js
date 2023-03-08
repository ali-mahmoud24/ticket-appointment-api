const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const { HttpError } = require('../models/http-error');

const Engineer = require('../models/engineer');
const Ticket = require('../models/ticket');

exports.addEngineer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { firstName, secondName, specialization } = req.body;

  const newEngineer = new Engineer({
    firstName,
    secondName,
    specialization,
  });

  try {
    await newEngineer.save();
  } catch (err) {
    const error = new HttpError(
      'Creating Engineer failed, please try again.',
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({ message: 'Engineer created!', engineerId: newEngineer._id });
};

exports.getEngineers = async (req, res, next) => {
  let loadedEngineers;
  try {
    loadedEngineers = await Engineer.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching Engineers failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!loadedEngineers || loadedEngineers.length === 0) {
    return next(new HttpError('Could not find Engineers.', 404));
  }

  res.status(200).json({
    engineers: loadedEngineers.map((engineer) =>
      engineer.toObject({ getters: true })
    ),
  });
};

exports.getEngineer = async (req, res, next) => {
  const { engineerId } = req.params;

  let loadedEngineer;
  try {
    loadedEngineer = await Engineer.findById(engineerId);
  } catch (err) {
    const error = new HttpError(
      'Finding user failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!loadedEngineer) {
    const error = new HttpError('No Such Engineer.', 404);
    return next(error);
  }
  res
    .status(200)
    .json({ engineer: loadedEngineer.toObject({ getters: true }) });
};

exports.updateEngineer = async (req, res, next) => {
  const { firstName, secondName, specialization } = req.body;
  const { engineerId } = req.params;

  let loadedEngineer;
  try {
    loadedEngineer = await Engineer.findById(engineerId);
  } catch (err) {
    const error = new HttpError(
      'Finding user failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!loadedEngineer) {
    const error = new HttpError('No Such Engineer found.', 404);
    return next(error);
  }

  loadedEngineer.firstName = firstName;
  loadedEngineer.secondName = secondName;
  loadedEngineer.specialization = specialization;

  try {
    await loadedEngineer.save();
  } catch (err) {
    const error = new HttpError(
      'Updating the Engineer failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: 'Enginner information updated successfully.',
    engineerId: loadedEngineer._id,
  });
};

exports.deleteEngineer = async (req, res, next) => {
  const { engineerId } = req.params;

  let loadedEngineer;
  try {
    loadedEngineer = await Engineer.findByIdAndDelete({ _id: engineerId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete engineer.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: 'Deleted the Engineer successfully.' });
};

exports.getTickets = async (req, res, next) => {
  let loadedTickets;
  try {
    loadedTickets = await Ticket.find({}).populate('engineerId');
  } catch (err) {
    const error = new HttpError(
      'Fetching tickets failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!loadedTickets || loadedTickets.length === 0) {
    return next(new HttpError('Could not find tickets.', 404));
  }

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  res.status(200).json({
    tickets: loadedTickets.map((ticket) => {
      const ticketSeralized = ticket.toObject({ getters: true });
      const ticketDate = ticketSeralized.time.toLocaleDateString(
        'ar-EG',
        dateOptions
      );
      const ticketTime = ticketSeralized.time.toLocaleTimeString(
        'ar-EG',
        timeOptions
      );

      const engineerName = `${ticket.engineerId.firstName} ${ticket.engineerId.secondName}`;

      return {
        ...ticketSeralized,
        engineerName,
        time: ticketTime,
        date: ticketDate,
      };
    }),
  });
};

// exports.deleteAppointment = async (req, res, next) => {
//   const { appointmentId } = req.params;

//   let appointment;
//   try {
//     appointment = await Appointment.findById(appointmentId);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete appointment.',
//       500
//     );
//     return next(error);
//   }

//   if (!appointment) {
//     const error = new HttpError('Could not find appointment for this id.', 404);
//     return next(error);
//   }

//   let user;
//   try {
//     user = await User.findById(appointment.userId);
//   } catch (err) {
//     const error = new HttpError(
//       'Deleting appointment failed, please try again.',
//       500
//     );
//     return next(error);
//   }

//   if (!user) {
//     const error = new HttpError(
//       'Could not find user with this appointment.',
//       404
//     );
//     return next(error);
//   }

//   // if (appointment.userId.id !== req.userData.userId) {
//   //   const error = new HttpError(
//   //     'You are not allowed to delete this appointment.',
//   //     401
//   //   );
//   //   return next(error);
//   // }

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     user.appointments.pull(appointment);
//     await appointment.remove({ session: sess });
//     await user.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete appointment.',
//       500
//     );
//     return next(error);
//   }

//   res.status(200).json({ message: 'Deleted appointment.' });
// };

// // exports.deleteAppointment = async (req, res, next) => {
// //   const { appointmentId } = req.params;

// //   let appointment;
// //   try {
// //     appointment = await Appointment.findByIdAndDelete({ _id: appointmentId });
// //     res.status(200).json({ message: 'Deleted an appointment.' });
// //   } catch (err) {
// //     const error = new HttpError(
// //       'Something went wrong, could not delete appointment.',
// //       500
// //     );
// //     return next(error);
// //   }
// // };
