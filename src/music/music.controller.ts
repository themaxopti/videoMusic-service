import { ApiError } from '../exceptions/api-error';
import { FileService } from '../services/fileService/File.service';
import { ResponseJson } from '../types/controller.types';
import { Controller } from './../types/express.types';
import { musicService } from './music.service';
import { AddCommentBody, AddTrackBody, TrackComment } from './types';



class MusicController {
    addMusic: Controller<null, AddTrackBody, ResponseJson<null>> =
        async (req, res, next) => {
            try {
                // @ts-ignore
                const { id } = req.user
                const track: any[] | any = req.files.track
                const picture = req.files.picture
                const isMp3 = FileService.checkMp3File(track)


                if (!isMp3) {
                    throw ApiError.BadRequest('Неверный формат файла')
                }


                const { description, title } = req.body
                console.log(track)
                await musicService.addTrack(title, description, picture, id, track)

                res.json({
                    message: 'ok',
                    statusCode: 200,
                    data: null
                })

            } catch (e) {
                next(e)
            }
        }

    addComment: Controller<null, AddCommentBody, ResponseJson<TrackComment>> =
        async (req, res, next) => {
            try {
                // @ts-ignore
                const { id } = req.user
                const { title, description, trackId } = req.body

                const trackComment = await musicService.addComment(title, description, id, trackId)

                res.json({
                    message: "ok",
                    statusCode: 200,
                    data: trackComment
                })

            } catch (e) {
                next(e)
            }
        }

    likeTrack: Controller<null, any, ResponseJson<null>> =
        async (req, res, next) => {
            try {
                // @ts-ignore
                const { id } = req.user
                const { trackId } = req.body

                await musicService.likeComment(id, trackId)

                res.json({
                    message: "ok",
                    statusCode: 200,
                    data: null
                })

            } catch (e) {
                next(e)
            }
        }
}


export const musicController = new MusicController()