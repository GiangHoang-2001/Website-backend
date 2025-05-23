const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

// Middleware để kiểm tra quyền admin
const authMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Authentication failed',
                status: 'ERROR'
            })
        }
        // Kiểm tra xem người dùng có phải là admin không
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(401).json({
                message: 'Authentication failed: Not authorized',
                status: 'ERROR'
            })
        }
    })
}

// Middleware để kiểm tra quyền của người dùng (cả admin và người dùng cá nhân)
const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(" ")[1]

    const userId = req.params.id
    if (!token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Authentication failed',
                status: 'ERROR'
            })
        }
        // Cho phép cả admin hoặc người dùng chính chủ
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(401).json({
                message: 'Authentication failed: Not authorized',
                status: 'ERROR'
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}
