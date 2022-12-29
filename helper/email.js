let mail = require("nodemailer")
require("dotenv").config()

async function email(mailoption) {
    return new Promise((resolve, reject) => {
        let transporter = mail.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        transporter.sendMail(mailoption, (error, info) => {

            if (error) {
                reject(false)
            }
            else {
                resolve("mail send", true)
            }
        })
    }
    )
}


module.exports = { email }