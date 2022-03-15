import { Strategy as LocalStrategy } from 'passport-local'
import db from '../../db'
import bcrypt from 'bcrypt'
import { ApiError } from '../../exceptions/api-error'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { NewUserDto } from '../user.dto'

export function configuteAuth() {
    return new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async function (username, password, done) {
            const error = ApiError.UnauthorizedError()
            const errorMessage = { message: error.message, errors: error.errors, statusCode: error.status }

            const errorMessageGoogle = { message: 'Ошибка авторизации', statusCode: 404 }

            // @ts-ignore
            const userByEmail = await db.query("SELECT id,password,email,google_id FROM users WHERE email=$1", [username])

            if (userByEmail.rowCount == 0) {
                return done('null', errorMessage)
            }

            const userWalidateByEmail = userByEmail.rows[0]

            const isUserIdGoogle = userWalidateByEmail.google_id
            if (isUserIdGoogle !== null) {
                return done('null', { id: 5 })
            }

            const isPassword = await bcrypt.compare(password, userWalidateByEmail.password)

            if (isPassword) {
                return done(null, { id: userWalidateByEmail.id, email: userWalidateByEmail.email })
            } else {
                return done('null', errorMessage)
            }
        }
    )
}

export function googleAuth() {
    return new GoogleStrategy({
        clientID: "462147460609-7lgsnou48vap620g40lkatccdtohs357.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: 'http://localhost:5500/auth/google/callback'
    },
        async function (issuer, cb, profile, done) {
            console.log(profile)
            const photo = profile.photos[0].value
            const userFinding = await db.query("SELECT * FROM users WHERE google_id=$1", [profile.id])
            const email = profile.emails[0].value
            if (userFinding.rowCount > 0) {
                const userFindingData = userFinding.rows[0]
                const userDto = new NewUserDto(userFindingData)
                return done(null, userDto)
            } else {
                const candidate = await db.query("SELECT * FROM users WHERE email=$1", [email])
                if (candidate.rowCount > 0) {
                    return done(null, null)
                }
                const query = "INSERT INTO users (name,is_active,password,email,subscribers_count,activate_link,google_id,photo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *"
                const newUser = await db.query(query, [profile.displayName, true, null, email, 0, null, profile.id,photo])

                const newUserData = newUser.rows[0]

                await db.query("INSERT INTO users_roles (user_id,role_id) VALUES ($1,$2)", [newUserData.id, 1])

                const userDto = new NewUserDto(newUserData)
                done(null, userDto)
            }
        }
    )
}