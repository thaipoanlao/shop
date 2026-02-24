// api/unlink-menu.js
export default async function handler(req, res) {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const userId = process.env.LINE_USER_ID; // รหัส U... ของคุณ

    try {
        // เปลี่ยนบรรทัด fetch ใน api/unlink-menu.js เป็นตัวนี้ครับ
        const response = await fetch(`https://api.line.me/v2/bot/richmenu/default`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return res.status(200).json({ 
            status: response.status, 
            message: "สั่งปลดเมนูริชสำเร็จแล้ว กรุณาเช็คในมือถือ" 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
