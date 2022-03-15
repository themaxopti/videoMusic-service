import jwt from 'jsonwebtoken'

import { ApiError } from "../exceptions/api-error"

export const authMiddleware = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        // @ts-ignore
        const authorizationHeader = req.headers.authorization

        const accessToken = authorizationHeader.split(' ')[1]

        if (!accessToken) {
            throw ApiError.UnauthorizedError()
        }

        const decoded = jwt.verify(accessToken, process.env.jwtSecret)

        console.log(decoded)
        req.user = decoded
        next()
    } catch (e) {
        next(e)
    }
}