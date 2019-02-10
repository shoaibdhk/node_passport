// const LocalStrategy = require('passport-local').Strategy,
//   GoogleStrategy = require('passport-google-oauth2'),
//   passport = require('passport'),
//   bcrypt = require('bcryptjs'),
//   User = require('../models/User')
import { Strategy as LocalStrategy } from 'passport-local'
import GoogleStrategy from 'passport-google-oauth2'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import User from '../models/User'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        email: email
      })
      if (!user) {
        return done(null, false, { message: 'That email is not registered' })
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      })
    } catch (err) {
      console.log(err)
    }
  })
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GCLIENT_ID,
      clientSecret: process.env.GCLIENT_SECRET,
      callbackURL: '/users/google/redirect'
    },
    async (accessToken, refreshToken, profile, done) => {
      //Passport callback function
      console.log('passport connection on fire')
      const errors = []
      try {
        const user = await new User({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          password: 123456
        }).save()
        console.log(`new user: ${user}`)
      } catch (e) {
        if (e.errors && e) {
          Object.keys(e.errors).forEach(key => errors.push({ msg: e.errors[key].message }))
          console.log(errors)
        }
      }
    }
  )
)

// export default passport
