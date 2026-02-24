// api/webhook.js
export default async function handler(req, res) {
    console.log("ได้รับข้อมูลจาก Beam:", JSON.stringify(req.body)); // เพิ่มบรรทัดนี้

    const event = req.body;

    if (event.type === 'charge.succeeded') {
        console.log("เงื่อนไขถูกต้อง กำลังส่งหา LINE..."); // เพิ่มบรรทัดนี้
        // ... โค้ดส่วน fetch หา LINE ...
    } else {
        console.log("เงื่อนไขไม่ตรง! event.type คือ:", event.type); // เพิ่มบรรทัดนี้
    }

    return res.status(200).json({ received: true });
}
