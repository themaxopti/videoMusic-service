import { ApiError } from "../../exceptions/api-error"
import path from 'path'
import fs from 'fs'
import { google } from "googleapis"
import e from "express"


interface FilePath {
    webContentLink: string
    webViewLink: string
}



export class FileService {
    private drive: any
    private oauth2Client: any
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            "462147460609-51mlg675dba19ecm512kejr337cgolj9.apps.googleusercontent.com",
            "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",
            "https://developers.google.com/oauthplayground"
        )

        this.drive = google.drive({
            version: 'v3',
            auth: this.oauth2Client
        })
    }

    moveFile(file) {
        if (file.length > 0) {
            throw ApiError.BadRequest('Вы можете загружать только один файл')
        }
        const filePath = path.join(__dirname, '..', '..', '..', 'static', 'files', `${file.name}`)
        file.mv(filePath)

        return filePath
    }

    deleteFile(filePath: string) {
        fs.unlink(filePath, function (err) {
            if (err) {
                throw ApiError.BadRequest('Ошибка в файловой системе')
            } else {
                console.log("Файл удалён");
            }
        });
    }


    async uploadFile(file: File): Promise<FilePath> {

        this.oauth2Client.setCredentials({ refresh_token: "1//04s-pBoKCL2-eCgYIARAAGAQSNwF-L9IrspAZvyUxI-VumkCCZz_l-qJ5OtXJIgNJ_9c2huLp2xClXy8Egl6AgaGnqdLLsc8HlzA" })
        const filePath = this.moveFile(file)
        console.log(filePath)
        const res = await this.drive.files.create({
            requestBody: {
                name: file.name,
                // @ts-ignore
                mimeType: file.mimetype
            },
            media: {
                // @ts-ignore
                mimeType: file.mimetype,
                body: fs.createReadStream(filePath)
            }
        })

        const dataGoogleUpload = res.data

        const publickLink = await this.getPublicPath(dataGoogleUpload.id)

        this.deleteFile(filePath)


        return publickLink
    }

    async getPublicPath(fileId: any): Promise<FilePath> {
        try {
            await this.drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })

            const result = await this.drive.files.get({
                fileId,
                fields: "webViewLink, webContentLink"
            })

            console.log(result.data)

            return result.data
        } catch (e) {

        }
    }

    static checkMp3File(file) {
        console.log(file.mimetype)
        if (file.mimetype == 'audio/mpeg') {
            return true
        } else {
            return false
        }
    }

    static checkPhoto(file) {
        console.log(file.mimetype)
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/svg') {
            return true
        } else {
            return false
        }
    }


    static checkFileCount(file){
        if (file.length > 0) {
            throw ApiError.BadRequest('Вы можете загружать только один файл')
        } 
    }



    async deleteFileFromDrive(fileId) {
        const response = await this.drive.files.delete({
            fileId
        })

        console.log(response.data, response.status)
    }
}


export const fileService = new FileService()
