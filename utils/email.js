const nodemailer = require('nodemailer')

const sendEmail =async options => {
  // 1 - Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // 2 - Define the email options
  const mailOptions = {
    from: 'Eric H <rico@club.fr>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  // 3 - Send the email with nodemailer
  await transporter.sendMail(mailOptions)
} 

module.exports = sendEmail