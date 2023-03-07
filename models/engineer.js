const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const engineerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Engineer', engineerSchema);
