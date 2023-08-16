//les routes pour les utilisateurs

const express = require('express');
const router = express.Router();
const userControl = require('../controllers/user');

const auth = require('../middleware/auth');



router.post('/signup', userControl.signup);
router.post('/login', userControl.login);




module.exports = router;