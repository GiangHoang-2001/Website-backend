const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword, } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await UserService.createUser(req.body)

        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra định dạng email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra nếu thiếu email hoặc password
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email and password are required'
            });
        }

        // Kiểm tra định dạng email hợp lệ
        if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        }

        // Gọi service để đăng nhập
        const response = await UserService.loginUser(req.body);

        // Nếu không có phản hồi từ service, trả về lỗi
        if (!response) {
            return res.status(404).json({
                status: 'ERR',
                message: 'User not found or invalid credentials'
            });
        }

        // Tách refresh_token khỏi response
        const { refresh_token, ...newResponse } = response;

        // Gửi refresh_token dưới dạng cookie
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false, // Đảm bảo secure=true khi chạy trên môi trường HTTPS
            sameSite: 'strict',
            path: '/'
        });

        // Trả về thông tin người dùng và access_token
        return res.status(200).json({
            status: 'OK',
            message: 'Login successful',
            ...newResponse,  // Cung cấp các thông tin còn lại từ response
            refresh_token   // Trả về refresh_token
        });

    } catch (e) {
        // Xử lý lỗi
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'An error occurred during login',
            error: e.message || e
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const refreshToken = async (req, res) => {
    try {
        const token = req.headers.token.split('')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
        return
    } catch (e) {
        return res.status(404).json({
            message: e
        })


    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany
}