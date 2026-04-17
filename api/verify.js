/**
 * 密码验证 API (Vercel Serverless Function)
 * 
 * 使用方式:
 * POST /api/verify
 * Body: { "code": "WQ-XXXX-XXXX" }
 * 
 * 返回:
 * { success: true } - 验证成功
 * { success: false, message: "错误信息" } - 验证失败
 */

// 存储已使用的密码（在实际部署中应该使用数据库）
let usedCodes = new Set();

// CORS 头
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

module.exports = async (req, res) => {
    // 处理 CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).set(corsHeaders).send('');
        return;
    }

    // 只允许 POST
    if (req.method !== 'POST') {
        res.status(405).json({ 
            success: false, 
            message: '只支持 POST 请求' 
        });
        return;
    }

    try {
        const { code } = req.body;

        // 验证格式
        const formatRegex = /^WQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!code || !formatRegex.test(code.toUpperCase())) {
            res.status(400).json({
                success: false,
                message: '访问码格式错误，例：WQ-AB12-CD34'
            });
            return;
        }

        const normalizedCode = code.toUpperCase();

        // 检查是否已使用（实际环境应该查询数据库）
        if (usedCodes.has(normalizedCode)) {
            res.status(400).json({
                success: false,
                message: '该访问码已被使用'
            });
            return;
        }

        // 验证密码池（示例，实际环境应该从数据库读取）
        const validCodes = [
            'WQ-AF23-XK91', 'WQ-BK78-PL34', 'WQ-CM45-QR89', 'WQ-DN12-ST67', 'WQ-EP56-UV23',
            'WQ-FQ89-WX45', 'WQ-GR34-YZ12', 'WQ-HS67-AB78', 'WQ-IT90-CD34', 'WQ-JU56-EF12',
            'WQ-KV23-GH89', 'WQ-LW78-IJ45', 'WQ-MX12-KL67', 'WQ-NY45-MN23', 'WQ-OP89-QR56',
            'WQ-PQ23-RS90', 'WQ-RT78-ST12', 'WQ-SU34-UV67', 'WQ-UV89-WX45', 'WQ-WX12-XY78',
            'WQ-XY56-ZA34', 'WQ-ZB90-AC12', 'WQ-AC67-DE45', 'WQ-DF23-FG89', 'WQ-GH78-HI34'
        ];

        if (!validCodes.includes(normalizedCode)) {
            res.status(400).json({
                success: false,
                message: '访问码无效'
            });
            return;
        }

        // 标记为已使用
        usedCodes.add(normalizedCode);

        // 返回成功
        res.status(200).json({
            success: true,
            message: '验证成功'
        });

    } catch (error) {
        console.error('验证错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};