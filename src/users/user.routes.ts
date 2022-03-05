import { Router } from "express";
import { UserController } from "./user.controller";

const userController = new UserController()
import { check } from 'express-validator'


const router = Router()

router.post(
    '/register',
    check('email', 'Некорректный емейл').isEmail(),
    check('name', 'Минимальная длина имя 2 символа').isLength({ min: 2 }),
    check('password', 'Минимальная длина пароля 4 символа').isLength({ min: 4 }),
    userController.registerUser
)

router.get('/test',(req,res) => {res.json('sada')} )

router.post('/login',userController.loginUser)
router.get('/activate/:link',userController.activateUser)
router.get('/auth',)
router.get('/user',)


export default router