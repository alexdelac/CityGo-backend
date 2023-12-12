var express = require('express');
var router = express.Router();

const UserPro = require('../models/usersPro')
const Etablissement = require('../models/etablissements')

//utilise le token pour retrouver l'id du usersPro puis recherche cet id dans les proprietaires d'établissements
router.post('/', (req, res)=>{
    UserPro.findOne({token: req.body.token})
        .then(userData=>{
            Etablissement.findOne({proprietaire: userData._id})
            .then(data=>{
                if(data){ // si trouvé envoi la data de l'établissement + infos usersPro
                    res.json({result: true, infos: data, user: {lastName: userData.lastName, firstName: userData.firstName, email: userData.email}})
                } else {// sinon return false et envoi uniquement les infos usersPro
                    res.json({result: false})
                }
            })
        })
})


// utilise le token pour retoruver l'id du proprietaire et créer un nouvel établissement
router.post('/create', (req, res)=>{
    UserPro.findOne({token: req.body.token})
        .then(data=>{
         const  newEtablissement = new Etablissement({
            name: req.body.name,
            proprietaire: data._id,
            type: req.body.type,
            siret: req.body.siret,
            description: req.body.description,
            photos: [],
            telephone: req.body.telephone,
            localisation: {
                adresse: req.body.adresse,
                ville: req.body.ville,
                codePostale: req.body.codePostale,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
         })

         newEtablissement.save()
            .then(data=>{
                res.json(data)
            })

        })
})





module.exports = router;