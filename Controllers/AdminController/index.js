const Joi = require("joi")
const UserModel = require("../../Models/User/User.model")

const AdminController = {
    //block unblock
    statusUpdate: async (req, res) => {
        try {
            const { role, status, email } = req.query
            //list
            const access_Status = ['blocked', 'unBlocked']
            const roleList = ['admin', 'user']

            //expected data
            const dataSchema = Joi.object({
                email: Joi.string().email().required(),
                access_Status: Joi.number().valid(0, 1),
                role: Joi.number().valid(0, 1)
            })

            //valid data
            const validData = dataSchema.validate({
                access_Status: status && Number(status),
                email: email,
                role: role && Number(role)
            })

            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.details
                })
            }
            if (status && !role) {
                await UserModel.findOneAndUpdate({ email: validData.value.email }, {
                    access_Status: access_Status[validData.value.access_Status]
                })
            } else if (role && !status) {
                await UserModel.findOneAndUpdate({ email: validData.value.email }, {
                    role: roleList[validData.value.role]
                })
            } else if (role && status) {
                await UserModel.findOneAndUpdate({ email: validData.value.email }, {
                    access_Status: access_Status[validData.value.access_Status],
                    role: roleList[validData.value.role]
                })
            } else {
                return res.status(400).json({
                    success: false,
                    error: "Bad request"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Status updated. "
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
}

module.exports = AdminController