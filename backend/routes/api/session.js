const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const axios = require('axios')

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

//Login
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
          email: credential
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }



    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      defaultLanguage: user.defaultLanguage,
      pfp: user.pfp
    };

    if (user.voice_id) {
      safeUser.voice_id = user.voice_id
    }

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

//Logout
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

//Restore session user
router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultLanguage: user.defaultLanguage,
        pfp: user.pfp
      };

      if (user.voice_id) {
        safeUser.voice_id = user.voice_id
      }

      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);

router.post('/oauth', async (req, res) => {
  const { newUser: authUser } = req.body
  console.log(authUser)

  const user = await User.findOne({
    where: {
        googleAccId: authUser.sub
    }
  });

  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      defaultLanguage: user.defaultLanguage,
      pfp: user.pfp
    };

    if (user.voice_id) {
      safeUser.voice_id = user.voice_id
    }

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
      exists: true
    });
  }


  const newUser = {
    email: authUser.email,
    pfp: authUser.picure,
    googleAccId: authUser.sub
  }

  if (authUser.locale) newUser.defaultLanguage = authUser.locale
  if (authUser.given_name || authUser.name) newUser.firstName = authUser.given_name || authUser.name
  if (authUser.family_name) newUser.lastName = authUser.family_name
  if (authUser.picture) newUser.pfp = authUser.picture

  console.log(authUser)

  res.status(200)
  return res.json(newUser)

})

module.exports = router;
