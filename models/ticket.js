const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  administration: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: false,
  },
  repairType: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  engineerId: {
    type: Schema.Types.ObjectId,
    ref: 'Engineer',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);
