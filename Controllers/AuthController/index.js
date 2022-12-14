const Joi = require("joi")
const bcrypt = require('bcryptjs')
const UserModel = require("../../Models/User/User.model")
const jwt = require("jsonwebtoken")
const AccountConfirmRequestMail = require("../../Mailer/ConfirmAccount")
const ForgetPasswordRequestMail = require("../../Mailer/ForgetPassword")
const ProfileModel = require("../../Models/Profile/Profile.model")

const AuthController = {
    //login
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            //data Validation
            const dataSchema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
            const validData = dataSchema.validate({ email, password })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            //valid user
            const user = await UserModel.findOne({ email: validData.value.email })
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found !!'
                })
            }
            if (!user.emailVerified) {
                return res.status(401).json({
                    success: false,
                    message: 'Email not verified. '
                })
            }
            if (!user.access_permission) {
                return res.status(401).json({
                    success: false,
                    message: 'This account is temporary block. '
                })
            }
            const haveAccess = bcrypt.compareSync(validData.value.password, user.password);

            if (!haveAccess) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password !!'
                })
            }

            //generate accessToken for user and return as response
            const token = jwt.sign({ email: user.email, role: user.role, PID: user.PID }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })

            return res.status(200).json({
                success: true,
                role: user.role,
                email,
                pid: user.PID,
                token: `Bearer ${token}`
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //registration
    registration: async (req, res) => {
        try {
            const { name, email, password } = req.body

            //data validation
            const dataSchema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                callBack_url: Joi.string().required()
            })
            const validData = dataSchema.validate({ name, email, password, callBack_url: process.env.LIVE_WEBSITE })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            //find user not registered previously
            const user = await UserModel.findOne({ email: validData.value.email })
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered .!'
                })
            }

            //hash password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            //create user
            const regUser = await UserModel.create({ ...validData.value, password: hash })

            //send verify email
            const response = await AccountConfirmRequestMail({ name: validData.value.name, userEmail: validData.value.email, callBack_url: validData.value.callBack_url })

            if (response.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Confirmation mail send to your email.'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Account created successfully .But confirmation mail can not send .Talk to support to resolve this issue'
                })
            }


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //social login
    google_login: async (req, res) => {
        try {
            const access = req.headers['authorization']
            if (!access) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid request.'
                })
            }
            const data = jwt.verify(access, '****google_sign_in****')
            const { name, email, email_verified, image } = data
            //find user by email
            const user = await UserModel.findOne({ email })
            //if user do login 
            if (!user) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(String(Math.random() * 10000), salt);
                const newUser = await UserModel.create({ name, email, password: hash, provider: 'google', emailVerified: email_verified })
                // console.log(newUser);
                //create profile
                const profile = await ProfileModel.create({ name, contact_email: email, picture: image })
                await UserModel.findOneAndUpdate({ email }, { PID: profile._id })


                //generate accessToken for user and return as response
                const token = jwt.sign({ email: newUser.email, role: newUser?.role, PID: profile._id }, process.env.JWT_SECRET, {
                    expiresIn: '24h'
                })

                return res.status(200).json({
                    success: true,
                    role: newUser.role,
                    email,
                    pid: newUser.PID,
                    token: `Bearer ${token}`
                })
            }

            //generate accessToken for user and return as response
            const token = jwt.sign({ email: user.email, role: user.role, PID: user.PID }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })

            return res.status(200).json({
                success: true,
                role: user.role,
                email,
                pid: user.PID,
                token: `Bearer ${token}`
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //email confirmation
    email_confirmation: async (req, res) => {
        try {
            const { token } = req.query

            //expected data schema
            const dataSchema = Joi.object({
                token: Joi.string().required(),
            })
            const validData = dataSchema.validate({ token })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }
            //verify token
            const validToken = jwt.verify(validData.value.token, process.env.JWT_SECRET)

            if (validToken) {
                //check current status 
                const status = await UserModel.findOne({ email: validToken.email })
                if (status.emailVerified) {
                    return res.status(200).json({
                        success: false,
                        message: 'Email already verified ...!'
                    })
                }

                //create profile
                const profile = await ProfileModel.create({ name: status.name, contact_email: validToken.email })

                //update user email verify status
                const updateEmailStatus = await UserModel.findOneAndUpdate({ email: validToken.email }, {
                    emailVerified: true,
                    PID: profile._id
                })

                return res.status(200).json({
                    success: true,
                    message: "Email verified success ."
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request ."
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //resend email verification mail
    resend_verification_mail: async (req, res) => {
        try {
            const { email, acc_verify_url } = req.body

            //expected data schema
            const dataSchema = Joi.object({
                email: Joi.string().email().required(),
                callBack_url: Joi.string().required()
            })
            const validData = dataSchema.validate({ email, callBack_url: acc_verify_url || "http://localhost:3000" })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            const user = await UserModel.findOne({ email: validData.value.email })
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request ."
                })
            }
            if (user.emailVerified) {
                return res.status(400).json({
                    success: false,
                    message: "Email already verified ."
                })
            }

            //send verify email
            const response = await AccountConfirmRequestMail({ userEmail: validData.value.email, callBack_url: validData.value.callBack_url })

            if (response.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Confirmation mail send to your email.'
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //forget-password
    forget_password: async (req, res) => {
        try {
            const { email, callBack_url } = req.body
            //expected data schema
            const dataSchema = Joi.object({
                email: Joi.string().email().required(),
                callBack_url: Joi.string().required()
            })
            const validData = dataSchema.validate({ email, callBack_url: callBack_url || "http://localhost:3000/reset-password" })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            const user = await UserModel.findOne({ email: validData.value.email })
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No user found ..!'
                })
            }

            //send  a email to user
            const response = await ForgetPasswordRequestMail({ userEmail: validData.value.email, callBack_url: validData.value.callBack_url })

            if (response.success) {
                return res.status(200).json({
                    success: true,
                    message: "A mail was send to your email. Follow mail instruction to recover your account ."
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Mail not send. Please contact to support."
                })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //reset-password
    reset_password: async (req, res) => {
        try {
            const { new_password } = req.body;
            const accessToken = req.headers['authorization']

            //expected data schema
            const dataSchema = Joi.object({
                new_password: Joi.string().required(),
                accessToken: Joi.string().required()
            })
            const validData = dataSchema.validate({ new_password, accessToken })
            if (!accessToken || validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message || "Invalid request ."
                })
            }

            const token = accessToken.split(' ')[1]
            const validJWT = jwt.verify(token, process.env.JWT_SECRET)

            if (validJWT) {
                //hash password
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(new_password, salt);

                await UserModel.findOneAndUpdate({ email: validJWT.email }, {
                    password: hash
                })

                return res.status(200).json({
                    success: true,
                    message: "Password reset complete."
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    // update/change password
    update_password: async (req, res) => {
        try {
            const { new_password } = req.body
            const email = req.email

            //expected dataSchema 
            const dataSchema = Joi.object({
                new_password: Joi.string().required(),
                email: Joi.string().email().required()
            })
            const validData = dataSchema.validate({ email, new_password })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request .',
                    hints: validData.error.message
                })
            }

            //hash password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(new_password, salt);

            //update password 
            await UserModel.findOneAndUpdate({ email }, {
                password: hash
            })

            return res.status(200).json({
                success: true,
                message: "Password updated successfully ."
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //delete user account
    delete_user: async (req, res) => {
        try {
            const id = req.userId
            //delete from a
            await UserModel.findOneAndDelete({ _id: id })
            return res.status(200).json({
                success: true,
                message: 'Delete successfully .'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = AuthController