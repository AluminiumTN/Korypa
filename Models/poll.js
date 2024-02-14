const {model, Schema} = require('mongoose')

let PollSchema = new Schema({
    GuildId: String,
    MessageId: String,
    Details: Array
});

module.exports = model('Poll', PollSchema)