const User = require("../models/UserModel")
const bcrypt = require('bcrypt')
const { generalAccessToken, generalRefreshToken } = require("./JwtService")
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            // console.log('checkUser', checkUser)
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already!'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            // console.log('hash', hash)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            // Kiểm tra người dùng trong MongoDB
            const checkUser = await User.findOne({ email: email });
            if (!checkUser) {
                // Người dùng không tồn tại
                return reject({
                    status: 'ERR',
                    message: 'The user is not defined'
                });
            }

            // So sánh mật khẩu (dùng bcrypt.compare cho bất đồng bộ)
            const comparePassword = await bcrypt.compare(password, checkUser.password);
            if (!comparePassword) {
                // Mật khẩu không đúng
                return reject({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                });
            }

            // Tạo access_token và refresh_token
            const access_token = await generalAccessToken({
                id: checkUser._id,  // Sử dụng _id thay vì id
                isAdmin: checkUser.isAdmin
            });

            const refresh_token = await generalRefreshToken({
                id: checkUser._id,  // Sử dụng _id thay vì id
                isAdmin: checkUser.isAdmin
            });

            // Trả về thông tin đăng nhập thành công
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            });

        } catch (e) {
            // Nếu có lỗi xảy ra
            reject({
                status: 'ERR',
                message: 'An error occurred during login',
                error: e
            });
        }
    });
};
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })

        } catch (e) {
            reject(e)
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            return resolve({
                status: 'OK',
                message: 'Success',
                data: user
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}