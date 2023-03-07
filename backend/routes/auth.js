const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:3000')
)

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json('done');
  });
})

module.exports = router;