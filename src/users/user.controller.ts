import { confirmAccountMessage } from './../services/mailService/mail.messages';
import { Controller } from './../types/express.types';
import { validationResult } from "express-validator"
import { StatusCode } from "../types/statusCode"
import { UserDto } from "./user.dto"
import { userService } from "./user.service"
import { Request, Response, NextFunction } from 'express';
import { ActiveParams, LoginBody, LoginResponse } from "./query.types";
import { ResponseJson } from '../types/controller.types';
import { mailService } from '../services/mailService/mailer.service';


export class UserController {
    async registerUser(req, res, next) {
        try {
            const errors = validationResult(req)
            await userService.validateUser(errors)

            const { name, email, password } = req.body

            const userDto: UserDto = {
                name,
                password,
                email
            }

            await userService.createUser(userDto)

            res.json({
                message: 'Пользователь создан успешно',
                statusCode: 200,
                data: null
            })
        } catch (e) {
            next(e)
        }
    }

    loginUser: Controller<null, LoginBody, ResponseJson<LoginResponse>> =
        async (req, res, next) => {
            try {
                const { name, email, password } = req.body
                const userDto: UserDto = { name, email, password }                                       //   @@Заменить на true в production    //
                const tokens = await userService.login(userDto)
                res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV == 'development' ? false : true, sameSite: 'none' })

                const { accessToken } = tokens

                res.json({
                    statusCode: 200, message: '', data: {
                        id: tokens.validateUser.id,
                        accessToken: accessToken,
                        name: tokens.validateUser.name,
                        subscribers_count: tokens.validateUser.subscribers_count,
                        email: tokens.validateUser.email,
                        isActive: tokens.validateUser.is_active
                    }
                })
            } catch (e) {
                next(e)
            }
        }


    async authUser(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }

    async logOutUser(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }

    activateUser: Controller<ActiveParams, null, ResponseJson<null>> = async (req, res, next) => {
        try {
            const { link } = req.params

            await userService.activateUser(link)

            res.json({
                message: 'Аккаунт успешно активирован',
                statusCode: 200,
                data: null
            })
        } catch (e) {
            next(e)
        }
    }
}