const router = require('express').Router(),
  User = require('../models/User'),
  bcrypt = require('bcryptjs'),
  passport = require('passport');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  let { name, email, password, password2 } = req.body,
    errors = [];
  if (!password) {
    errors.push({ msg: `Password required` });
    return res.status(400).render('register', { errors, name, email, password, password2 });
  } else if (password !== password2) {
    errors.push({ msg: `Password didn't match` });
    return res.status(400).render('register', { errors, name, email, password, password2 });
  }

  try {
    const user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 12)
    });
    const newUser = await user.save();
    req.flash('success_msg', 'You are now registered');
    res.redirect('/users/login');
  } catch (e) {
    if (e.errors && e) {
      Object.keys(e.errors).forEach(key => errors.push({ msg: e.errors[key].message }));
    }
    // res.status(400).json(err);
    res.status(400).render('register', { errors, name, email, password, password2 });
  }
});

// Login Handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handler

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'you are logged out');
  res.redirect('/users/login');
});

// Login with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send('You have reached to the google URI');
});
module.exports = router;
