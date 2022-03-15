import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import logout from 'express-passport-logout'

const userController = new UserController()
import { check } from 'express-validator'
import passport from "passport";
import path from "path";

export function loggedI(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.json({
            message: "Вы не авторизованы",
            statusCode: 404
        })
    }
}

const router = Router()

router.post(
    '/register',
    check('email', 'Некорректный емейл').isEmail(),
    check('name', 'Минимальная длина имя 2 символа').isLength({ min: 2 }),
    check('password', 'Минимальная длина пароля 4 символа').isLength({ min: 4 }),
    userController.registerUser
)
router.post('/login', userController.loginUser)
router.get('/activate/:link', userController.activateUser)
router.get('/auth', authMiddleware, userController.authUser)
router.get('/refresh', userController.refresh)
router.get('/logout', userController.logOutUser)

router.post('/uploadAvatar',loggedI,userController.uploadAvatar)


router.post('/loginPass', passport.authenticate('local'), (req, res, next) => {
    try {
        res.json(req.user)
    } catch (e) {
        next(e)
    }
})

router.get("/authPass", loggedI, (req, res) => {
    try {
        console.log('===========')
        res.json(req.user)
    } catch (e) {
        console.log(e)
    }
})

router.get('/logoutPass', (req, res) => {
    try {
        req.logout()
        req.session.destroy(err => {
            if (err) {
                return res.send({ error: 'Logout error' })
            }
            req.session = null
            res.clearCookie('all')
            return res.send(req.cookies)
        })
        console.log(req.cookies)
    } catch (e) {
        console.log(e)
    }
});


export default router