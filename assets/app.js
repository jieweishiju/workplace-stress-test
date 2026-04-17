/**
 * 职场抗压能力测试 - 主逻辑
 * 包含通用工具函数
 */

// ============ 工具函数 ============

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 格式化时间（秒转分钟:秒）
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 深拷贝对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const copy = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepClone(obj[key]);
            }
        }
        return copy;
    }
}

/**
 * 生成唯一ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 存储管理器
 */
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('存储失败:', e);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.warn('读取失败:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            return false;
        }
    }
};

/**
 * 本地密码验证（开发模式）
 */
async function verifyCodeLocally(code) {
    try {
        const response = await fetch('data/codes.json');
        const data = await response.json();
        
        const isValid = data.codes.includes(code);
        const isUsed = data.used_codes.includes(code);
        
        if (!isValid) {
            return { success: false, message: '访问码不存在' };
        }
        
        if (isUsed) {
            return { success: false, message: '该访问码已被使用' };
        }
        
        return { success: true };
    } catch (e) {
        return { success: false, message: '验证服务暂时不可用' };
    }
}

// ============ 页面初始化 ============

document.addEventListener('DOMContentLoaded', () => {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.body.classList.toggle('mobile', isMobile);
    
    // 添加页面加载完成标记
    document.body.classList.add('loaded');
});

// ============ SVG 渐变定义 ============
// 在 result.html 中需要使用
const svgGradientDef = `
<svg width="0" height="0">
    <defs>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea" />
            <stop offset="100%" style="stop-color:#764ba2" />
        </linearGradient>
    </defs>
</svg>
`;

// 动态注入渐变
document.addEventListener('DOMContentLoaded', () => {
    const temp = document.createElement('div');
    temp.innerHTML = svgGradientDef;
    document.body.appendChild(temp.firstElementChild);
});