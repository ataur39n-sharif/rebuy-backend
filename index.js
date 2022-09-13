require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const mailTransporter = require('./Config/NodeMailer/nodemailer.config')


const app = express()
app.use(cors())
app.use(express.json())
app.use('/', require('./Routes/index'))

const PORT = process.env.PORT || 5000

const uri = `${process.env.MONGODB_URL}`
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("db ready"))
    .catch((err) => console.log(err));

mailTransporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.listen(PORT, () => {
    console.log(`Server is listing on Port - ${PORT}`);
})