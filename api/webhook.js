// api/webhook.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const event = req.body;

    // ตรวจสอบเหตุการณ์ชำระเงินสำเร็จจาก Beam
    if (event.type === 'charge.succeeded') {
        const charge = event.data.object;
        const amount = charge.amount / 100; // แปลงสตางค์เป็นบาท
        const refId = charge.referenceId;

        const messageText = `💰 แจ้งเตือนยอดเข้า!\n------------------\nออเดอร์: ${refId}\nจำนวนเงิน: ${amount.toLocaleString()} บาท\nสถานะ: จ่ายสำเร็จแล้ว ✅`;

        // ส่งข้อความผ่าน LINE Messaging API (Push Message)
        try {
            await fetch('https://api.line.me/v2/bot/message/push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    to: process.env.LINE_USER_ID, // ส่งหาคุณโดยตรง
                    messages: [{
                        type: "text",
                        text: messageText
                    }]
                })
            });
            console.log("LINE Notification Sent");
        } catch (error) {
            console.error("LINE Messaging Error:", error);
        }
    }

    return res.status(200).json({ received: true });
}
