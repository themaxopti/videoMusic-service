import db from '../db'
import { ApiError } from '../exceptions/api-error'
import { fileService } from '../services/fileService/File.service'
import { TrackComment } from './types'


class MusicService {
    async addTrack(description, title, picture, id, track) {
        const { webViewLink } = await fileService.uploadFile(track)
        const { webViewLink: webViewLinkPicture } = await fileService.uploadFile(picture)
        console.log(webViewLink)
        const query = 'INSERT INTO track (title,author_id,picture,src,description,likes) VALUES ($1,$2,$3,$4,$5,$6)'
        await db.query(query, [title, id, webViewLinkPicture, webViewLink, description, 0])
    }



    async addComment(title: string, description, authorId: number, trackId): Promise<TrackComment> {
        const response = await db.query("SELECT * FROM  track WHERE id=$1", [trackId])
        if (response.rowCount == 0) {
            throw ApiError.NotFound('Такого трека не найдено')
        }
        const query = 'INSERT INTO track_comments (title,author_id,description,track_id) VALUES ($1,$2,$3,$4) RETURNING *'
        const trackComent = await db.query(query, [title, authorId, description, trackId])
        return trackComent.rows[0]
    }

    async likeComment(id: number, trackId: number) {
        const response = await db.query("SELECT * FROM  track WHERE id=$1", [trackId])
        if (response.rowCount == 0) {
            throw ApiError.NotFound('Такого трека не найдено')
        }

        let isLiked = await db.query("SELECT * from likes_tracks WHERE user_id=$1 and track_id=$2", [id, trackId])

        if (isLiked.rowCount > 0) {
            await db.query("DELETE FROM likes_tracks WHERE user_id=$1 and track_id=$2", [id, trackId])
            await db.query('UPDATE track SET likes=likes - 1 WHERE id=$1', [trackId])
        } else {
            await db.query("INSERT INTO likes_tracks (track_id,user_id) VALUES ($1,$2)", [trackId, id])
            await db.query('UPDATE track SET likes = likes + 1  WHERE id=$1', [trackId])
        }
    }


}

export const musicService = new MusicService()