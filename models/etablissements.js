const mongoose = require('mongoose')

const localisationSchema = mongoose.Schema({
    adresse: String,
    ville: String,
    codePostale: Number,
    latitude: Number,
    longitude: Number,
})

const etablissementsSchema = mongoose.Schema({
    name: String,
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'userspros' },
    type: [String],
    siret: Number,
    description: String,
    photos: [String],
    telephone: String,
    localisation: localisationSchema,
    
})

const Etablissement = mongoose.model('etablissements', etablissementsSchema)

module.exports = Etablissement