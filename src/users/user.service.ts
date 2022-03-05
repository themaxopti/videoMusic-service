import { UserDto } from "./user.dto"
import db from '../db'
import { ApiError } from "../exceptions/api-error"
import bcrypt from 'bcrypt'
import { TokenService } from "./token.service"
import { v4 as uuidv4 } from 'uuid';
import { confirmAccountMessage } from "../services/mailService/mail.messages"
import { mailService } from "../services/mailService/mailer.service"

export class UserService {
    async createUser(body: UserDto) {
        const { email, password, name } = body

        await this.checkUser(body)

        const hashedPassword = await bcrypt.hash(password, 12)
        const activate_link = uuidv4()

        const newUser = await db.query('INSERT INTO users (name,is_active,password,email,subscribers_count,activate_link) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [name, false, hashedPassword, email, 0, activate_link])

        const newGrabedUser = newUser.rows[0]

        const messageEmail = confirmAccountMessage(newGrabedUser.activate_link, newGrabedUser.email)
        await mailService.sendMail(newGrabedUser.email, 'Письмо для подтверждения аккаунта', messageEmail)


        return newUser
    }

    async login(body: UserDto) {
        const validateUser = await this.checkLoginningUser(body)
        const { refreshToken, accessToken } = await TokenService.createTokens(body)
        await TokenService.saveToken(validateUser.id, refreshToken)


        // const messageEmail = confirmAccountMessage(validateUser.activate_link, validateUser.email)
        // await mailService.sendMail(validateUser.email, 'Письмо для подтверждения аккаунта', messageEmail)

        return { refreshToken, accessToken, validateUser }
    }

    async authUser(req, res) {
        try {

        } catch (e) {
            console.log(e)
        }
    }

    async logOutUser(req, res) {
        try {

        } catch (e) {
            console.log(e)
        }
    }

    async checkUser(body: UserDto) {
        const { email } = body

        const response = await db.query("SELECT email FROM users WHERE email=$1", [email])

        if (response.rowCount != 0) {
            throw ApiError.BadRequest('Пользователь уже существует')
        }
    }

    async validateUser(errors: any) {
        if (!errors.isEmpty()) {
            console.log(errors)
            const errorsArray = []
            errors.errors.forEach((err: any) => {
                errorsArray.push(err.msg)
            })
            throw ApiError.BadRequest('Некорректные данные при регистрации', errorsArray)
        }
    }

    async checkLoginningUser(body: UserDto) {
        const { email, password, name } = body


        const userByEmail = await db.query("SELECT email,password,name,id,is_active,subscribers_count,activate_link FROM users WHERE email=$1", [email])

        if (userByEmail.rowCount == 0) {
            throw ApiError.NotFound('Пользователь не найден')
        }

        const userWalidateByEmail = userByEmail.rows[0]

        // @ts-ignore
        const isPassword = await bcrypt.compare(password, userWalidateByEmail.password)

        if (!isPassword) {
            throw ApiError.NotFound('Неверный емейл или пароль')
        }

        return userWalidateByEmail
    }

    async activateUser(link) {
        const candidate = await db.query("SELECT id,name FROM users WHERE activate_link=$1 ", [link])

        if (candidate.rowCount > 0) {
            const { id } = candidate.rows[0]
            await db.query("UPDATE users SET is_active=true WHERE id=$1", [id])
        } else {
            throw ApiError.BadRequest("Ошибка")
        }
    }
}

export const userService = new UserService()