import { Router } from "express"
import passport from "passport"

const router = Router()


router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/loginFail', successRedirect: "http://localhost:5500/" }),
    function (req, res) {
        // @ts-ignore
        console.log(req.user)
        // res.send(req.user)
        // res.redirect('http://localhost:5500/')
        res.send('blalba')
    }
)

export default router