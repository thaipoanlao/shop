// api/webhook.js
export default async function handler(req, res) {
    console.log("ได้รับข้อมูลจาก Beam:", JSON.stringify(req.body));

    const event = req.body;

    if (event.type === 'charge.succeeded') {
        const charge = event.data.object;
        const amount = charge.amount / 100;
        const refId = charge.referenceId;

        const messageText = `💰 ยอดเข้าใหม่! ✅\n------------------\nออเดอร์: ${refId}\nจำนวนเงิน: ${amount.toLocaleString()} บาท\nสถานะ: ชำระเงินเรียบร้อย`;

        try {
            console.log("กำลังส่งหา LINE User ID:", process.env.LINE_USER_ID);
            
            const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
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

            const responseData = await lineResponse.json();
            console.log("LINE Response Status:", lineResponse.status);
            console.log("LINE Response Body:", JSON.stringify(responseData));

            if (lineResponse.status === 200) {
                console.log("ส่งเข้า LINE สำเร็จแล้ว!");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดขณะส่งหา LINE:", error);
        }
    }

    return res.status(200).json({ received: true });
}
