import nodemailer from "nodemailer"
import config from "../config/config.js"

const { user, pass } = config

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user,
                pass
            }
        })
    }

    send = async(user, subject, html) => {
        const result = await this.transport.sendMail({
            from: `CoderCommerce <${user}>`,
            to: user.email,
            subject,
            html
        })

        return result
    }
}