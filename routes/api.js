import express from 'express'
import passport from 'passport'
import fetch from 'isomorphic-fetch'
const router = express.Router()


function getCurrentUser (token) {
  return fetch('http://oauth.reddit.com/api/v1/me.json', {
    headers: {
      'User-Agent': 'liveylive-reddit-v1',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(data => data.json())
}

/**
 * @Route -> /api/me -> {req.user}
 * Return the current Authenticated User.
 */
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user)
  }
)

router.get('/reddit/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    getCurrentUser(req.user.redditAccessToken)
    .then((data) => {
      res.json(data)
    })
    .catch(err => {
      res.json(err)
    })
  }
)


export default router
