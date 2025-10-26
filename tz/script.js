// 全局变量
let allData = [];
let filteredData = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载数据
    loadData();
    
    // 绑定事件
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    
    // 输入框实时搜索（防抖处理）
    const inputs = ['supplierSearch', 'projectNoSearch', 'projectNameSearch'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', debounce(performSearch, 300));
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
});

// 防抖函数，避免频繁搜索
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

// 加载JSON数据
async function loadData() {
    try {
        const response = await fetch('data.json');
        allData = await response.json();
        
        // 预处理数据：确保所有字段都有值
        allData = allData.map(item => ({
            ...item,
            supplierName: item.supplierName || '',
            projectNo: item.projectNo || '',
            projectName: item.projectName || '',
            contractNo: item.contractNo || '-',
            purchaseOrderNo: item.purchaseOrderNo || '-',
            quantity: item.quantity || 0,
            unit: item.unit || '-',
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0
        }));
        
        filteredData = [...allData];
        displayData();
        updateResultCount();
        
        // 初始化后自动聚焦到第一个搜索框
        document.getElementById('supplierSearch').focus();
    } catch (error) {
        console.error('加载数据失败:', error);
        alert('数据加载失败，请检查data.json文件是否存在且格式正确');
    }
}

// 执行搜索（增强版模糊搜索）
function performSearch() {
    const supplierKeyword = document.getElementById('supplierSearch').value.trim();
    const projectNoKeyword = document.getElementById('projectNoSearch').value.trim();
    const projectNameKeyword = document.getElementById('projectNameSearch').value.trim();
    
    // 如果所有搜索框都为空，显示所有数据
    if (!supplierKeyword && !projectNoKeyword && !projectNameKeyword) {
        filteredData = [...allData];
        displayData();
        updateResultCount();
        return;
    }
    
    filteredData = allData.filter(item => {
        let matchSupplier = true;
        let matchProjectNo = true;
        let matchProjectName = true;
        
        // 供应商名称模糊匹配
        if (supplierKeyword) {
            matchSupplier = fuzzyMatch(item.supplierName, supplierKeyword);
        }
        
        // 项目号模糊匹配
        if (projectNoKeyword) {
            matchProjectNo = fuzzyMatch(item.projectNo, projectNoKeyword);
        }
        
        // 项目名称模糊匹配
        if (projectNameKeyword) {
            matchProjectName = fuzzyMatch(item.projectName, projectNameKeyword);
        }
        
        return matchSupplier && matchProjectNo && matchProjectName;
    });
    
    displayData();
    updateResultCount();
}

// 模糊匹配函数
function fuzzyMatch(text, pattern) {
    if (!text || !pattern) return false;
    
    const textLower = text.toString().toLowerCase();
    const patternLower = pattern.toLowerCase();
    
    // 简单包含匹配
    if (textLower.includes(patternLower)) {
        return true;
    }
    
    // 中文简拼匹配（简单版）
    if (isChinese(pattern)) {
        const textPinyin = getSimplePinyin(text);
        const patternPinyin = getSimplePinyin(pattern);
        if (textPinyin.includes(patternPinyin)) {
            return true;
        }
    }
    
    return false;
}

// 判断是否为中文字符
function isChinese(str) {
    return /[\u4e00-\u9fa5]/.test(str);
}

// 获取简单拼音（首字母）
function getSimplePinyin(str) {
    if (!str) return '';
    
    // 简单的中文拼音映射（实际项目中可以使用完整的拼音库）
    const pinyinMap = {
        '宁': 'n', '夏': 'x', '朝': 'c', '红': 'h', '印': 'y', '刷': 's', '有': 'y', '限': 'x', '公': 'g', '司': 's',
        '浙': 'z', '江': 'j', '活': 'h', '氧': 'y', '泉': 'q', '食': 's', '品': 'p', '责': 'z', '任': 'r', '北': 'b',
        '京': 'j', '兆': 'z', '兴': 'x', '纸': 'z', '制': 'z', '四': 's', '川': 'c', '保': 'b', '罗': 'l', '包': 'b',
        '装': 'z', '科': 'k', '技': 'j', '烟': 'y', '台': 't', '金': 'j', '元': 'y', '东': 'd', '莞': 'g', '精': 'j',
        '诚': 'c', '制': 'z', '罐': 'g', '山': 's', '东': 'd', '药': 'y', '用': 'y', '玻': 'b', '璃': 'l', '青': 'q',
        '海': 'h', '领': 'l', '榜': 'b', '工': 'g', '贸': 'm', '龙': 'l', '彩': 'c', '德': 'd', '鑫': 'x', '徐': 'x',
        '州': 'z', '城': 'c', '南': 'n', '宫': 'g', '润': 'r', '丰': 'f', '毛': 'm', '毡': 'z', '袋': 'd', '普': 'p',
        '宁': 'n', '佳': 'j', '胜': 's', '天': 't', '津': 'j', '香': 'x', '江': 'j', '绍': 's', '兴': 'x', '上': 's',
        '虞': 'y', '京': 'j', '煜': 'y', '塑': 's', '业': 'y', '大': 'd', '连': 'l', '华': 'h', '光': 'g', '色': 's',
        '三': 's', '和': 'h', '美': 'm', '景': 'j', '有': 'y', '机': 'j', '玻': 'b', '璃': 'l', '广': 'g', '州': 'z',
        '新': 'x', '代': 'd', '泉': 'q', '州': 'z', '礼': 'l', '相': 'x', '伴': 'b'
    };
    
    let result = '';
    for (let char of str) {
        if (pinyinMap[char]) {
            result += pinyinMap[char];
        } else if (/[a-zA-Z0-9]/.test(char)) {
            result += char.toLowerCase();
        }
    }
    return result;
}

// 重置搜索
function resetSearch() {
    document.getElementById('supplierSearch').value = '';
    document.getElementById('projectNoSearch').value = '';
    document.getElementById('projectNameSearch').value = '';
    
    filteredData = [...allData];
    displayData();
    updateResultCount();
    
    // 重置后聚焦到供应商搜索框
    document.getElementById('supplierSearch').focus();
}

// 显示数据到表格
function displayData() {
    const tableBody = document.getElementById('tableBody');
    const noResults = document.getElementById('noResults');
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    tableBody.innerHTML = filteredData.map(item => `
        <tr>
            <td>${item.contractNo}</td>
            <td>${item.purchaseOrderNo}</td>
            <td class="supplier-cell">${highlightMatch(item.supplierName, document.getElementById('supplierSearch').value)}</td>
            <td>${highlightMatch(item.projectNo, document.getElementById('projectNoSearch').value)}</td>
            <td class="project-name-cell">${highlightMatch(item.projectName, document.getElementById('projectNameSearch').value)}</td>
            <td class="number-cell">${formatNumber(item.quantity)}</td>
            <td class="unit-cell">${item.unit}</td>
            <td class="number-cell">¥${formatNumber(item.unitPrice)}</td>
            <td class="number-cell total-price">¥${formatNumber(item.totalPrice)}</td>
        </tr>
    `).join('');
}

// 高亮匹配文本
function highlightMatch(text, keyword) {
    if (!keyword || !text) return text || '-';
    
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    
    return text.toString().replace(regex, '<mark class="highlight">$1</mark>');
}

// 更新结果计数
function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    const keyword = document.getElementById('supplierSearch').value || 
                   document.getElementById('projectNoSearch').value || 
                   document.getElementById('projectNameSearch').value;
    
    if (keyword && filteredData.length > 0) {
        resultCount.textContent = `找到 ${filteredData.length} 条匹配记录`;
        resultCount.className = 'result-count has-results';
    } else if (keyword && filteredData.length === 0) {
        resultCount.textContent = `未找到匹配记录`;
        resultCount.className = 'result-count no-results';
    } else {
        resultCount.textContent = `共 ${filteredData.length} 条记录`;
        resultCount.className = 'result-count';
    }
}

// 数字格式化（千分位）
function formatNumber(num) {
    if (num === undefined || num === null) return '-';
    return Number(num).toLocaleString('zh-CN');
}