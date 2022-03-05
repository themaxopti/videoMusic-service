import * as nodemailer from 'nodemailer'

class MailService {
    private transporter: any

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            service: 'gmail',
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendMail(to: string, subject: string, html) {

        let result = await this.transporter.sendMail({
            from: 'tes@gmail.com',
            to,
            subject,
            text: `Здравствуйте ${to} ,пожалуйста, подтвердите свой аккаунт`,
            html
        }).catch(e => console.log(e))


        console.log(process.env.SMTP_USER, '====', process.env.SMTP_PASSWORD)
    }
}

export const mailService = new MailService()