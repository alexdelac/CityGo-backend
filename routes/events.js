const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const Etablissement = require('../models/etablissements');
const UserPro = require('../models/usersPro');
const User = require('../models/users')

// POST : Récupération des évènements existants du UserPro
router.post('/', (req, res) => {
    UserPro.findOne({ token: req.body.token })
        .then(userProData => {
            console.log(userProData);
            if (userProData) {
                Etablissement.findOne({ proprietaire: userProData._id })
                    .then(etablissementData => {
                        console.log(etablissementData);
                        if (etablissementData) {
                            Event.find({ etablissement: etablissementData._id })
                                .then(eventsData => {
                                    console.log(eventsData);
                                    res.json({ result: true, events: eventsData })
                                })
                        } else {
                            res.json({ result: false, error: 'Aucun évènement trouvé' })
                        }
                    })
            }
        })
})

// POST : Création d'un nouvel évènement 
router.post('/create', (req, res) => {
    UserPro.findOne({ token: req.body.token })
        .then(userProData => {
            console.log(userProData);
            if (userProData) {
                Etablissement.findOne({ proprietaire: userProData._id })
                    .then(etablissementData => {
                        if (etablissementData) {

                            const startTime = new Date(req.body.startTime);
                            const endTime = new Date(req.body.endTime);

                            const newEvent = new Event({
                                title: req.body.title,
                                startTime: startTime,
                                endTime: endTime,
                                recurrence: req.body.recurrence,
                                eventType: req.body.eventType,
                                description: req.body.description,
                                etablissement: etablissementData._id,
                            })
                            newEvent.save()
                                .then(savedEvent => {
                                    res.json(savedEvent)
                                })
                        } else {
                            res.json({ result: false, error: 'Etablissement non trouvé' })
                        }
                    })
            } else {
                res.json({ result: false, error: 'Propriétaire non trouvé' })
            }
        })
})

// DELETE : Suppression d'un évènement 
router.delete('/', (req, res) => {
    Event.deleteOne({ _id: req.body._id })
        .then(result => {
            if (result.deletedCount > 0) {
                res.json({ result: true, response: 'Event deleted from data base' });
            } else {
                res.json({ result: false, response: 'Event not found or already deleted' });
            }
        })
})

router.post('/display', async (req, res) => {
    try {
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);

        const currentDate = new Date(req.body.date);

        const etablissements = await Etablissement.find({
            'localisation.coordinates': {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 1000, // 1 km
                },
            },
        });

        const etablissementIds = etablissements.map(etablissement => etablissement._id);


        const events = await Event.find({
            etablissement: { $in: etablissementIds },
            startTime: { $lte: currentDate },
            endTime: { $gte: currentDate },
        }).populate('etablissement'); // Utiliser populate pour récupérer les données de l'établissement associé à chaque événement

        const formattedEvents = events.map(event =>{ 
            return {
            id: event._id,
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            type: event.eventType,
            description: event.description,
            etablissement: {
                id: event.etablissement._id,
                name: event.etablissement.name,
                type: event.etablissement.type,
                description: event.etablissement.description,
                telephone: event.etablissement.telephone,
                adresse: event.etablissement.adresse,
                photos: event.etablissement.photos,
                localisation: event.etablissement.localisation
                // Ajouter d'autres champs de l'établissement si nécessaire
            },
           
        }});

        res.json({ result: true, data: formattedEvents });

    } catch (error) {
        console.error('Erreur lors de la recherche géospatiale :', error);
        res.status(500).json({ result: false, error: 'Erreur serveur' });
    }
});

module.exports = router;

