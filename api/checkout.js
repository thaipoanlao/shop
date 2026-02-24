// api/checkout.js
export default async function handler(req, res) {
    // 1. รับเฉพาะคำสั่งแบบ POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 2. ดึงค่าจาก Environment Variables ใน Vercel
        const merchantId = process.env.MERCHANT_ID; // ต้องไปเพิ่มตัวแปรนี้ใน Vercel
        const apiKey = process.env.BEAM_SECRET_KEY; // คือ Merchant API Key (รหัส aVKab...)

        // 3. ทำ Authentication แบบ Basic Auth (Base64 encoding) ตามเอกสาร Beam
        const auth = Buffer.from(`${merchantId}:${apiKey}`).toString('base64');

        // 4. ส่งข้อมูลไปยัง Endpoint /api/v1/charges
        const response = await fetch('https://api.beamcheckout.com/api/v1/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify(req.body) // ข้อมูลทั้งหมดจะถูกส่งมาจากหน้า index.html
        });

        const data = await response.json();
        
        // 5. ส่งผลลัพธ์กลับไปที่หน้าเว็บ
        return res.status(response.status).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
