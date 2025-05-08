const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const sendEmailCreateOrder = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let listItem = '';
    const attachImage = []
    orderItems.forEach((order) => {
        listItem += `<div>
        <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
        <div>Bên dưới là hình ảnh sản phẩm</div>
        </div>`
        attachImage.push({ path: order.image })
    })

    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: "htgiang29082001@gmail.com",
        subject: "Bạn đã đặt hàng tại SHOPMALL ✔",
        text: "Hello world?",
        html: `<div><b>Bạn đã đặt hàng thành công tại SHOPMALL</b></div>${listItem}`,
        attachments: attachImage
    });
}

module.exports = {
    sendEmailCreateOrder
}