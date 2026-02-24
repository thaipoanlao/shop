// api/webhook.js
export default async function handler(req, res) {
    const event = req.body;

    if (event.type === 'charge.succeeded') {
        const charge = event.data.object;
        const amount = charge.amount / 100; // แปลงหน่วยสตางค์เป็นบาท
        const refId = charge.referenceId;

        // สร้างเวลาปัจจุบันรูปแบบไทย
        const paymentTime = new Intl.DateTimeFormat('th-TH', {
            dateStyle: 'medium',
            timeStyle: 'medium',
            timeZone: 'Asia/Bangkok'
        }).format(new Date());

        // ข้อความแจ้งเตือนฉบับปรับปรุงตามคำขอ
        const messageText = `🏪 ร้านค้า: shop.thpl.me
💰 แจ้งเตือนยอดเข้า! ✅
--------------------------
ออเดอร์: ${refId}
จำนวนเงิน: ${amount.toLocaleString()} บาท
เวลา: ${paymentTime}
สถานะ: ชำระเงินสำเร็จแล้ว
--------------------------
เช็ครายละเอียดเพิ่มเติมได้ที่:
https://lighthouse.beamcheckout.com/merchant/porbaanfmly/dashboard`;

        try {
            await fetch('https://api.line.me/v2/bot/message/push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    to: process.env.LINE_USER_ID,
                    messages: [{ type: "text", text: messageText }]
                })
            });
        } catch (error) {
            console.error("LINE Messaging Error:", error);
        }
    }

    return res.status(200).json({ received: true });
}
