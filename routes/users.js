var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users')
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


//creation dun nouvel utilisateur dans la collection users
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['pseudonyme', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        pseudonyme: req.body.pseudonyme,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        liked: [],
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});


//verification du email et du password dun utilisateur
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, pseudonyme: data.pseudonyme });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

//modification du mot de passe dun utilisateur
router.put('/updatePassword', (req, res) => {
  if (!checkBody(req.body, ['token', 'oldPassword', 'newPassword', 'confirmPassword'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ token: req.body.token })
    .then(userData => {
      if (userData) {
        if (bcrypt.compareSync(req.body.oldPassword, userData.password)) {
          if (req.body.newPassword === req.body.confirmPassword) {
            const hash = bcrypt.hashSync(req.body.newPassword, 10);
            User.updateOne(
              { token: req.body.token },
              { password: hash }
            ).then((responseData) => {
              if (responseData.modifiedCount > 0) {
                res.json({ result: true, message: 'password changed' })
              } else {
                res.json({ result: false, error: 'The password could not be changed' })
              }

            })
          } else {
            res.json({ result: false, error: 'Confirmation password does not work' })
          }

        } else {
          res.json({ result: false, error: 'Wrong password' })
        }
      } else {
        res.json({ result: false, error: 'User not found' })
      }

    })
});

<<<<<<< HEAD
//modification du mail et du pseudo de lutilisateur
router.put('/updateInfo', (req, res) => {
  if (!checkBody(req.body, ['token', 'pseudonyme', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ token: req.body.token })
    .then(userData => {
      if (userData) {

        const updateFields = {
          pseudonyme: req.body.pseudonyme,
          email: req.body.email
        };

        User.updateOne(
          { token: req.body.token },
          { $set: updateFields },
        ).then((responseData) => {
          if (responseData.modifiedCount > 0) {
            res.json({ result: true, message: 'Info changed' });
          } else {
            res.json({ result: false, error: 'Info could not be changed' });
          }
        }).catch(err => {
          console.error(err);
          res.json({ result: false, error: 'An error occurred during update' });
        });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
});

//suppression du compte utilisateur
router.delete('/deleteAccount', (req, res) => {
  //res.json({result: true})
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.deleteOne({ token: req.body.token })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.json({ result: true, message: 'Account deleted successfully' });
      } else {
        res.json({ result: false, error: 'Account not found or could not be deleted' });
      }
    })
});

=======

router.post('/like', (req, res)=>{
  //recherche le document du user pour acceder au tableau liked
  User.findOne({token: req.body.token})
    .then(data=>{
      //transforme l'etablissementId sous forme de string en object id pour la comparaison
      const id =new mongoose.Types.ObjectId(req.body.etablissementId) 
      //recherche si l'établissementId est présent dans le tableau liked
      if(!data.liked.includes(id)){
        //si non ajoute l'établissementId
        User.updateOne({token: req.body.token}, {$push: {liked: id}})
          .then(data=>{
            console.log(data)
            res.json({result: true, action: 'liked'})
          })
      } else {
        //si oui supprime l'établissementId
        User.updateOne({token: req.body.token}, {$pull: {liked: id}})
        .then(data=>{
          res.json({result: true, action: 'unliked'})
        })
      }
    })
})
>>>>>>> a4589f3eb601696a6b2f11a49cd62c5a33ad648d

module.exports = router;
