import { confirmAccountMessage } from './../services/mailService/mail.messages';
import { Controller } from './../types/express.types';
import { validationResult } from "express-validator"
import { StatusCode } from "../types/statusCode"
import { UserDto } from "./user.dto"
import { userService } from "./user.service"
import { Request, Response, NextFunction } from 'express';
import { ActiveParams, AuthParams, AuthResponse, LoginBody, LoginResponse, RefreshParams, RefreshResponse } from "./query.types";
import { ResponseJson } from '../types/controller.types';
import { mailService } from '../services/mailService/mailer.service';
import { IS_PROD } from '../utils/constants';
import path from 'path'
import fs from 'fs'
import { ApiError } from '../exceptions/api-error';
import { FileService, fileService } from '../services/fileService/File.service';
import db from '../db'


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
                const userDto: UserDto = { name, email, password }
                const tokens = await userService.login(userDto)
                const isProd = process.env.NODE_ENV == 'development' ? false : true
                res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: isProd, sameSite: 'none' })

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


    authUser: Controller<AuthParams, null, ResponseJson<AuthResponse>> =
        async (req, res, next) => {
            try {
                // @ts-ignore
                const userId = req.user.id
                console.log(userId)

                const user = await userService.authUser(userId)

                res.json({
                    message: 'Пользователь успешно вошел',
                    statusCode: 200,
                    data: user
                })

            } catch (e) {
                next(e)
            }
        }

    refresh: Controller<RefreshParams, null, ResponseJson<RefreshResponse>> =
        async (req, res, next) => {
            try {
                const { refreshToken } = req.cookies

                const { token, accessToken } = await userService.refreshUser(refreshToken)
                const isProd = process.env.NODE_ENV == 'development' ? false : true

                res.cookie('refreshToken', token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: isProd, sameSite: 'none' })

                res.json({
                    message: "Вы авторизовались",
                    statusCode: 200,
                    data: {
                        accessToken
                    }
                })
            } catch (e) {
                next(e)
            }
        }

    logOutUser: Controller<null, null, ResponseJson<null>> = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies
            await userService.logOutUser(refreshToken)

            res.clearCookie('refreshToken', { httpOnly: true, secure: IS_PROD, sameSite: 'none' })

            res.json({
                message: 'Пользователь вышел',
                statusCode: 200,
                data: null
            })
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

    uploadAvatar: Controller<any, any, any> = async (req, res, next) => {
        try {
            // @ts-ignore
            const { id } = req.user

            const files: any[] | any = req.files.some
            FileService.checkFileCount(files)
            const isPhoto = FileService.checkPhoto(files)
            if(!isPhoto){
                throw ApiError.BadRequest('Не тот формат')
            }
            const path = await fileService.uploadFile(files)

            await db.query("UPDATE users SET photo=$1 WHERE id=$2", [path.webViewLink, id])

            res.json({
                message:'ok',
                statusCode:200,
                data:null
            })
        } catch (e) {
            next(e)
        }
    }
}