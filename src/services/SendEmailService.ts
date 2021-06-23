import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

class SendEmailService {
    private client: Transporter

    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = transporter
        })
    }

    async execute(to: string, subject: string, variables: object, path: string) {
        const templateFileContent = fs.readFileSync(path).toString('utf8')

        const emailTemplateParse = handlebars.compile(templateFileContent)

        const html = emailTemplateParse(variables)

        const message = await this.client.sendMail({
            to,
            subject,
            html: html,
            from: "NPS <noreply@nps.com.br>"
        })

        console.log("Message sent: ", message.messageId)
        console.log("Preview URL: ", nodemailer.getTestMessageUrl(message))
    }
}

export default new SendEmailService()