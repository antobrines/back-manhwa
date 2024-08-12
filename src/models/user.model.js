const mongoose = require('mongoose')
const types = mongoose.Schema.Types

const userSchema = mongoose.Schema(
  {
    username: {
      type: types.String,
      required: true,
      unique: true,
    },
    password: {
      type: types.String,
      required: true,
    },
    email: {
      type: types.String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
