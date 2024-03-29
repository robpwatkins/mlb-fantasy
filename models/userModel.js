const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    required: false
  },
  username: {
    type: String,
    unique: true
  },
  username_customized: {
    type: Boolean,
    required: true
  },
  last_login: {
    type: Date,
    default: null
  },
  provider: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean
  },
  total_wins: {
    type: Number,
    require: true
  },
  total_losses: {
    type: Number,
    require: true
  }
})

userSchema.statics.signup = async function(email, password) {
  if (!email || !password) throw Error('Missing credentials');
  if (!validator.isEmail(email)) throw Error('Email is not valid');
  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

  const existingUser = await this.findOne({ email });

  if (existingUser) {
    if (existingUser.provider !== 'email') {
      throw Error(`Please login using your original method (${existingUser.provider})`);
    }
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    provider: 'email',
    email,
    password: hash,
    username: email,
    username_customized: false
  });

  console.log('user: ', user);

  return user;
}

userSchema.statics.login = async function(email, password) {
  if (!email || !password) throw Error('All fields must be filled');

  const user = await this.findOne({ email });

  if (!user) throw Error('Incorrect email');

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw Error('Incorrect password');

  return user;
}

module.exports = mongoose.model('User', userSchema);
