// api/unlink-menu.js
export default async function handler(req, res) {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN; // ใช้ Token ใหม่ที่คุณเพิ่งเปลี่ยน

    try {
        // 1. ดึงรายการ Rich Menu ทั้งหมดที่มีอยู่ใน Channel นี้
        const listResponse = await fetch('https://api.line.me/v2/bot/richmenu/list', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listResponse.json();
        const richmenus = listData.richmenus || [];

        if (richmenus.length === 0) {
            return res.status(200).json({ message: "ไม่พบ Rich Menu ค้างอยู่ในระบบแล้ว" });
        }

        // 2. ไล่ลบทิ้งทีละอันตาม ID
        const results = [];
        for (const menu of richmenus) {
            const deleteRes = await fetch(`https://api.line.me/v2/bot/richmenu/${menu.richMenuId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            results.push({ id: menu.richMenuId, status: deleteRes.status });
        }

        return res.status(200).json({
            message: `ลบเมนูริชออกไปทั้งหมด ${richmenus.length} รายการแล้ว`,
            details: results
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
