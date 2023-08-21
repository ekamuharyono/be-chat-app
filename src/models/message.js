const mongoose = require('../config/db');

const Schema = mongoose.Schema;
const messageSchema = new Schema({
  sender: String,
  receiver: String,
  text: String
});
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;