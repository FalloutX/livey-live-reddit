import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  _id: String,
  comment_karma: Number,
  link_karma: Number,
  redditAccessToken: String,
  redditRefreshToken: String
})

export default mongoose.model('User', userSchema)
