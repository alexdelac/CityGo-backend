var express = require('express');
var router = express.Router();

const UserPro = require('../models/usersPro')
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    if (!checkBody(req.body, ['lastName', 'firstName', 'email', 'password', 'phoneNumber'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    // Check if the user has not already been registered
    UserPro.findOne({ email: req.body.email }).then(data => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);
  
        const newUser = new UserPro({
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          email: req.body.email,  
          password: hash,
          phoneNumber: req.body.phoneNumber,
          token: uid2(32),
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
  
  router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['email', 'password'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    UserPro.findOne({ email: req.body.email }).then(data => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token });
      } else {
        res.json({ result: false, error: 'User not found or wrong password' });
      }
    });
  });


module.exports = router;