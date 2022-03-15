import { Router } from "express"
import { loggedI } from "../users/user.routes"
import { musicController } from "./music.controller"

const router = Router()


router.post('/addTrack',loggedI,musicController.addMusic)
router.post('/addCommentTrack',loggedI,musicController.addComment)
router.post('/likeTrack',loggedI,musicController.likeTrack)




export default router