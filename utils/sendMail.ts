import nodemailer from "nodemailer"

// Function to send email
export default async function sendEmail(to:string, subject:string, html:string) {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service:"gmail",
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        auth: {
            user: process.env.BUSINESS_EMAIL, 
            pass: process.env.BUSINESS_EMAIL_APP_PASSWORD  
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Setup email data
    let mailOptions = {
        to: to,                       // list of receivers
        subject: subject,             // Subject line
        html: html                    // plain html body
    };

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email: %s', error);
    }
}
