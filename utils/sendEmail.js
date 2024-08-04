const nodemailer = require("nodemailer");
const sendEmail = async (sent_name,subject, message, send_to, sent_from, reply_to) => {

  // Create Email Transporter
  const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587, // Use 465 if SSL/TLS is required
  secure: false, // Set to true if using port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allows self-signed certificates
  },
});

  // Option for sending email
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,

  };

  // send email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  
};

module.exports = sendEmail;