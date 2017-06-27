import express from 'express'
import config from '../config'
import passport from 'passport'
import crypto from 'crypto'

const router = express.Router()


router.get('/guess/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user) {
      res.json({info: 'successfully-booted-up', user: req.user, token: req.user.appToken})
    } else {
      res.json({info: 'successfully-booted-up', login: 'http://127.0.0.1:3010/login/reddit'})
    }
  }
)

router.get('/reddit', function (req, res, next) {
  req.session.state = crypto.randomBytes(32).toString('hex')
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent'
  })(req, res, next)
})

router.get('/reddit/callback',
  passport.authenticate('reddit', {
    failureRedirect: '/login/reddit'
  })
, (req, res) => {
  res.redirect(`${config.frontend.server}user?jwt=${req.user.appToken}`)
})

export default router
