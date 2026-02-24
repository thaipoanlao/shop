export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const event = req.body;

    // รับเหตุการณ์ charge.succeeded จาก Beam
    if (event.type === 'charge.succeeded') {
        const charge = event.data.object;
        const amount = charge.amount / 100; // แปลงหน่วยสตางค์เป็นบาท
        const refId = charge.referenceId;

        // ข้อความที่จะส่งเข้า LINE
        const messageText = `💰 ยอดเข้าใหม่! ✅\n------------------\nออเดอร์: ${refId}\nจำนวนเงิน: ${amount.toLocaleString()} บาท\nสถานะ: ชำระเงินเรียบร้อย`;

        // ส่ง Push Message ผ่าน LINE Messaging API
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
    }

    return res.status(200).json({ received: true });
}
