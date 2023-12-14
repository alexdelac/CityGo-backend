const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const Etablissement = require('../models/etablissements');
const UserPro = require('../models/usersPro');

// POST Récupération des évènements existants du UserPro
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
                        res.json({ result: false, error: 'Aucun évènement trouvé'})
                }
            })
        }
    })
})

// POST Création d'un nouvel évènement 
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

                    const newEvent = new Event ({
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
                    })} else {
                        res.json({result: false, error: 'Etablissement non trouvé'})
                    }
                })
            } else {
                res.json({result: false, error: 'Propriétaire non trouvé'})
            }
        })
    })

module.exports = router;

