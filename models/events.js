const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    title: String,
    startTime: Date, 
    endTime: Date,
    recurrence: String,
    eventType: [String],
    description: String,
    etablissement: { type: mongoose.Schema.Types.ObjectId, ref: 'etablissements' }
})


const Event = mongoose.model('events', eventSchema)

module.exports = Event