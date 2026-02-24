// api/checkout.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        const merchantId = process.env.MERCHANT_ID;
        const apiKey = process.env.BEAM_SECRET_KEY;

        // การทำ Basic Auth: รวม ID และ Key เข้าด้วยกันแล้วแปลงเป็น Base64
        const auth = Buffer.from(`${merchantId}:${apiKey}`).toString('base64');

        const response = await fetch('https://api.beamcheckout.com/api/v1/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}` // เปลี่ยนเป็น Basic Auth ตามเอกสาร
            },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();
        
        // ลองส่งค่ากลับไปเช็คดู
        if (response.ok) {
            return res.status(200).json(JSON.parse(text));
        } else {
            console.error('Beam API Error:', text);
            return res.status(response.status).send(text);
        }

    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
