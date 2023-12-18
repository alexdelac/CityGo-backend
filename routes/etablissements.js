var express = require('express');
var router = express.Router();

const UserPro = require('../models/usersPro')
const Etablissement = require('../models/etablissements')
const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

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
        .then(userData=>{
         const  newEtablissement = new Etablissement({
            name: req.body.name,
            proprietaire: userData._id,
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
                res.json({result: true, infos: data, user: {lastName: userData.lastName, firstName: userData.firstName, email: userData.email}})
            })

        })
})


router.put('/update', (req, res)=>{
    UserPro.findOne({token: req.body.token})
    .then(userData=>{
        Etablissement.updateOne({proprietaire: userData._id}, {name: req.body.name,
            type: req.body.type,
            siret: req.body.siret,
            description: req.body.description,
            telephone: req.body.telephone,
            localisation: {
                adresse: req.body.adresse,
                ville: req.body.ville,
                codePostale: req.body.codePostale,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
            })
        .then(data=>{
                res.json({result: true, infos: data, user: {lastName: userData.lastName, firstName: userData.firstName, email: userData.email}})
        })
    })
})

router.put('/upload/:token', async (req, res) => {
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);
   
    if (!resultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(photoPath);
        fs.unlinkSync(photoPath); 
        UserPro.findOne({token: req.params.token})
            .then(userData =>{
                Etablissement.updateOne({proprietaire: userData._id}, {$push: {photos: resultCloudinary.secure_url}})
                .then(data=>{
                    if(data){
                        res.json({ result: true }); 
                    }
                })
            })

           
    } else {
      res.json({ result: false, error: resultMove });
    }
   });



module.exports = router;