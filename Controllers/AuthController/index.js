const Joi = require("joi")
const bcrypt = require('bcryptjs')
const UserModel = require("../../Models/User/User.model")
const jwt = require("jsonwebtoken")
const AccountConfirmRequestMail = require("../../Mailer/ConfirmAccount")
const ForgetPasswordRequestMail = require("../../Mailer/ForgetPassword")

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
                    error: validData.error.message
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
            const haveAccess = bcrypt.compareSync(validData.value.password, user.password);

            if (!haveAccess) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password !!'
                })
            }

            //generate accessToken for user and return as response
            const token = jwt.sign({ email: user.email, role: user.role, UID: user._id }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })

            return res.status(200).json({
                success: true,
                role: user.role,
                token: `Bearer ${token}`
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    //registration
    registration: async (req, res) => {
        try {
            const { name, email, password, acc_verify_url } = req.body

            //data validation
            const dataSchema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                callBack_url: Joi.string().required()
            })
            const validData = dataSchema.validate({ name, email, password, callBack_url: acc_verify_url || 'http://localhost:5000' })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
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
            const response = await AccountConfirmRequestMail({ userEmail: validData.value.email, callBack_url: validData.value.callBack_url })

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
                error: error.message
            })
        }
    },
    //email confirmation
    email_confirmation: async (req, res) => {
        try {
            const { token } = req.params

            //expected data schema
            const dataSchema = Joi.object({
                token: Joi.string().required(),
            })
            const validData = dataSchema.validate({ token })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
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

                //update user email verify status
                const updateEmailStatus = await UserModel.findOneAndUpdate({ email: validToken.email }, {
                    emailVerified: true
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
                error: error.message
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
            const validData = dataSchema.validate({ email, callBack_url: acc_verify_url })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
                })
            }

            const user = await UserModel.findOne({ email: validData.value.email })
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
                error: error.message
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
            const validData = dataSchema.validate({ email, callBack_url })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
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
            return res.status(500).json({
                success: false,
                error: error.message
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
                    error: validData.error.message || "Invalid request ."
                })
            }

            const token = accessToken.split(' ')[1]
            const validJWT = jwt.verify(token, process.env.JWT_SECRET)

            if (validJWT) {
                await UserModel.findOneAndUpdate({ email: validJWT.email }, {
                    password: new_password
                })

                return res.status(200).json({
                    success: true,
                    message: "Password reset complete."
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
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
                    error: 'Invalid request .',
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
                error: error.message
            })
        }
    },
    //delete user account
    delete_user: async (req, res) => {
        try {
            const id = req.userId

            await UserModel.findOneAndDelete({ _id: id })
            return res.status(200).json({
                success: true,
                message: 'Delete successfully .'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

module.exports = AuthController