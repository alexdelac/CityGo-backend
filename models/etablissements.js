const mongoose = require('mongoose')

const localisationSchema = mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
})


const etablissementsSchema = mongoose.Schema({
    name: String,
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'userspros' },
    type: [String],
    siret: Number,
    description: String,
    photos: [String],
    telephone: String,
    adresse: String,
    localisation: localisationSchema,
    
})

const Etablissement = mongoose.model('etablissements', etablissementsSchema)

module.exports = Etablissement