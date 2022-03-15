import 'dotenv/config'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import express from "express"
import cookie from 'cookie-parser'
import cors from 'cors'
import userRoutes from './users/user.routes'
import errorMiddleWare from './middlewares/errors.middleware'
import session from 'express-session'
import passport from 'passport'
import { configuteAuth, googleAuth } from './users/passportAuth/configuration'
import MongoDBStore from 'connect-mongodb-session'
import path from 'path'
import authRoutes from './users/auth.routes'
import passportHttp from 'passport-http'
import { google } from 'googleapis'
import fs from 'fs'
import fileUpload from 'express-fileupload';
import musicRoutes from './music/music.routes'
const MongoDBStoreClass = MongoDBStore(session)




const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: '*' }))
app.use(cookie())
app.use(fileUpload({}))
app.use(session({
    secret: "maxim",
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    store: new MongoDBStoreClass({
        uri: "mongodb+srv://themaxopti:456852@cluster0.uznvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        collection: "sessions",
        databaseName: "fondy"
    })
}))
app.use(passport.initialize())
app.use(passport.session())


passport.use(configuteAuth());
passport.use(googleAuth())


passport.serializeUser(function (user, done) {
    // @ts-ignore
    console.log(user + 'po')
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    // @ts-ignore
    done(null, user);
})




// Routes
app.use('/api', userRoutes)
app.use('/auth', authRoutes)
app.use('/api', musicRoutes)
// Routes


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'index.html'))
})

app.get('/loginFail', (req, res) => {
    res.redirect('https://www.google.com/search?q=google+.com&oq=google+.com&aqs=chrome..69i57j0i20i263i512j0i512j69i60l3j69i65l2.4790j0j7&sourceid=chrome&ie=UTF-8')
    res.send('Что-то пошло не так')
})

// Errors
app.use(errorMiddleWare)
// Errors


app.use(express.static(__dirname + '/static'))


app.listen(process.env.PORT || 5500, () => {
    console.log(`Server has been started on port 5000`)
})