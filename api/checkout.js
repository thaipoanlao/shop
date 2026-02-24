// api/checkout.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        const SECRET_KEY = process.env.BEAM_SECRET_KEY;
        
        // ส่งข้อมูลไป Beam
        const response = await fetch('https://api.beamcheckout.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET_KEY}`
            },
            body: JSON.stringify(req.body) 
        });

        const text = await response.text(); // อ่านผลลัพธ์เป็นข้อความก่อน
        
        try {
            const data = JSON.parse(text); // ลองแปลงเป็น JSON
            return res.status(response.status).json(data);
        } catch (e) {
            // ถ้า Beam ส่ง HTML มา (Error) ให้ Log ดูว่าคืออะไร
            console.error('Beam Error Response:', text);
            return res.status(500).json({ error: "Beam API Error - Check your Secret Key" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
