const jwt = require("jsonwebtoken");
const mailTransporter = require("../../Config/NodeMailer/nodemailer.config");

const AccountConfirmRequestMail = async ({ name, userEmail, callBack_url }) => {

    //create a token 
    const token = jwt.sign({ email: userEmail, name }, process.env.JWT_SECRET, {
        expiresIn: "5m"
    })

    //create verify url
    const link = `${callBack_url}/?token=${token}`

    const report = await mailTransporter.sendMail({
        from: 'Support <contact@ataur.dev>',
        to: userEmail,
        replyTo: "noreply@ataur.dev",
        subject: "Verify your email .",
        html: `
        <div>
            <h3>Congratulation - Account successfully Created .</h3>
            <p>Here is the last step - <b>Verify your email</b> .</p>
            <p>To verify your email click this confirm link - <a href=${link}>Confirm</a></p>
            <p>Note : This email is only valid for 5min.</p>
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

module.exports = AccountConfirmRequestMail