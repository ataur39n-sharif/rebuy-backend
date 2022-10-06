const jwt = require("jsonwebtoken");
const mailTransporter = require("../../Config/NodeMailer/nodemailer.config");

const ForgetPasswordRequestMail = async ({ userEmail, callBack_url }) => {

    //create a token 
    const token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
        expiresIn: "5m"
    })

    //create verify url
    const link = `${callBack_url}?token=${token}`

    const report = await mailTransporter.sendMail({
        from: 'Support <contact@ataur.dev>',
        to: userEmail,
        replyTo: "noreply@ataur.dev",
        subject: "Account recovery request .",
        html: `
        <div>
            <h5>Thank's for your request .</h5>
            <p>Follow this mail instruction for - <b> recover your account</b> .</p>
            <p>To recover your account click this link - <a href=${link}>Go next</a></p>
            <strong>Note : This email is only valid for 5min.</strong>
        </div>
        `
    })
    if (report.messageId) {
        return {
            success: true,
        }
    } else {
        return {
            success: false
        }
    }
}

module.exports = ForgetPasswordRequestMail