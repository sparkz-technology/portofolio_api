import constant from "../../configs/constant.js"
import nodemailer from "nodemailer"

const { AUTH_EMAIL, AUTH_EMAIL_PASSWORD, TO_EMAIL } = constant

export default function sendMail(options, callback) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: AUTH_EMAIL,
      pass: AUTH_EMAIL_PASSWORD,
    },
  })
  const mailOptions = {
    from: AUTH_EMAIL,
    to: TO_EMAIL,
    subject: options.subject,
    text: options.message,
  }
  transporter.sendMail(mailOptions, callback)
}
