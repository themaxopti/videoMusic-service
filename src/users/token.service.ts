import jwt from 'jsonwebtoken'
import { UserDto } from './user.dto'
import db from '../db'

export class TokenService {
    static async createTokens(payload: UserDto) {
        const { email, name } = payload
        const newDto = { email, name }

        const accessToken = jwt.sign(newDto, process.env.jwtSecret, { expiresIn: '30m' })
        const refreshToken = jwt.sign(newDto, process.env.jwtSecret, { expiresIn: '30d' })

        return {
            accessToken,
            refreshToken
        }
    }

    static async saveToken(userId, token) {
        const tokenData = await db.query("SELECT token FROM token WHERE user_id=$1", [userId])
        console.log(tokenData.rows[0])
        if (tokenData.rowCount > 0) {
            await db.query("UPDATE token SET token=$2 WHERE user_id=$1", [userId, token])
        } else {            
            const savedToken = await db.query("INSERT INTO token (token,user_id) VALUES ($1,$2) RETURNING *", [token, userId])
            return savedToken
        }
    }

    static async validateToken(token) {
        try {
            const userData = jwt.verify(token, process.env.jwtSecret)
            return userData
        } catch (e) {
            return null
        }
    }

    static async removeToken(refreshToken) {
        await db.query("DELETE FROM token WHERE token=$1", [refreshToken])
    }

    static async findToken(refreshToken) {
        const tokenData = await db.query("SELECT id,token,user_id FROM token WHERE token=$1", [refreshToken])
        return tokenData
    }
}