const jwt = require("jsonwebtoken")

const AuthorizeUser = async (req, res, next) => {
    try {
        const headersToken = req.headers['authorization']
        if (!headersToken) {
            return res.status(400).json({
                success: false,
                error: "UnAuthorize Access .!"
            })
        }
        const token = headersToken.split(" ")[1]
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        if (verifyToken) {
            req.email = verifyToken.email
            req.userId = verifyToken?.UID
            req.role = verifyToken?.role
            req.authorized = true
            next()
        } else {
            return res.status(400).json({
                success: false,
                error: "UnAuthorize Access .!"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = AuthorizeUser