import config from './config'
import passportReddit from 'passport-reddit'
import User from './models/User'
import jwt from 'jsonwebtoken'

function generateJWT (username) {
  return jwt.sign({ username }, config.jwt.secret, { expiresIn: 60 * 60 * 24 * 100 })
}


const strategy = new passportReddit.Strategy({
  clientID: config.reddit.clientID,
  clientSecret: config.reddit.clientSecret,
  callbackURL: config.reddit.callbackURL
},
(accessToken, refreshToken, profile, cb) => {
  console.log('Authentication Successful => ', accessToken, refreshToken)
  User.findById(profile._json.name, function (err, user) {
    if (err) {
      console.log(err)
      return cb(err)
    }
    if (user) {
      user.redditAccessToken = accessToken
      user.redditRefreshToken = refreshToken
      user.link_karma = profile._json.link_karma
      user.comment_karma = profile._json.comment_karma
      user.save(function (err) {
        if (err) {
          console.log('Error occuring while updating user', err)
        } else {
          console.log('User successfully updated')
        }
        user.appToken = generateJWT(user._id)
        return cb(null, user)
      })
    } else {
      let newUser = new User({
        _id: profile._json.name,
        redditAccessToken: accessToken,
        redditRefreshToken: refreshToken,
        link_karma: profile._json.link_karma,
        comment_karma: profile._json.comment_karma
      })
      newUser.save(function (err) {
        if (err) {
          console.log('Error occuring while adding new user', err)
        } else {
          console.log('User successfully added to DB')
        }
        newUser.appToken = generateJWT(newUser._id)
        return cb(null, newUser)
      })
    }
  })
})


export default strategy
