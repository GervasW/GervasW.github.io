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
    
    // 输入框回车搜索
    const inputs = ['supplierSearch', 'projectNoSearch', 'projectNameSearch'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
});

// 加载JSON数据
async function loadData() {
    try {
        const response = await fetch('data.json');
        allData = await response.json();
        filteredData = [...allData];
        displayData();
        updateResultCount();
    } catch (error) {
        console.error('加载数据失败:', error);
        alert('数据加载失败，请检查data.json文件');
    }
}

// 执行搜索
function performSearch() {
    const supplierKeyword = document.getElementById('supplierSearch').value.toLowerCase().trim();
    const projectNoKeyword = document.getElementById('projectNoSearch').value.toLowerCase().trim();
    const projectNameKeyword = document.getElementById('projectNameSearch').value.toLowerCase().trim();
    
    filteredData = allData.filter(item => {
        const matchSupplier = !supplierKeyword || 
            (item.supplierName && item.supplierName.toLowerCase().includes(supplierKeyword));
        
        const matchProjectNo = !projectNoKeyword || 
            (item.projectNo && item.projectNo.toLowerCase().includes(projectNoKeyword));
        
        const matchProjectName = !projectNameKeyword || 
            (item.projectName && item.projectName.toLowerCase().includes(projectNameKeyword));
        
        return matchSupplier && matchProjectNo && matchProjectName;
    });
    
    displayData();
    updateResultCount();
}

// 重置搜索
function resetSearch() {
    document.getElementById('supplierSearch').value = '';
    document.getElementById('projectNoSearch').value = '';
    document.getElementById('projectNameSearch').value = '';
    
    filteredData = [...allData];
    displayData();
    updateResultCount();
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
            <td>${item.contractNo || '-'}</td>
            <td>${item.purchaseOrderNo || '-'}</td>
            <td>${item.supplierName || '-'}</td>
            <td>${item.projectNo || '-'}</td>
            <td>${item.projectName || '-'}</td>
            <td>${formatNumber(item.quantity)}</td>
            <td>${item.unit || '-'}</td>
            <td>¥${formatNumber(item.unitPrice)}</td>
            <td>¥${formatNumber(item.totalPrice)}</td>
        </tr>
    `).join('');
}

// 更新结果计数
function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    resultCount.textContent = `共 ${filteredData.length} 条记录`;
}

// 数字格式化（千分位）
function formatNumber(num) {
    if (num === undefined || num === null) return '-';
    return Number(num).toLocaleString('zh-CN');
}