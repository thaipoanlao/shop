// api/checkout.js
export default async function handler(req, res) {
    // กำหนดให้รองรับเฉพาะการส่งข้อมูลแบบ POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const SECRET_KEY = process.env.BEAM_SECRET_KEY; // ดึงรหัสลับจาก Environment Variable

        // ส่งข้อมูลไปยัง Beam Checkout API
        const response = await fetch('https://api.beamcheckout.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET_KEY}`
            },
            body: JSON.stringify(req.body) 
        });

        const data = await response.json();

        // ส่งผลลัพธ์กลับไปให้หน้าเว็บ (Frontend)
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Beam Proxy Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
