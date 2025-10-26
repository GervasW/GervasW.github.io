let data = [];

// 加载 JSON 数据
fetch('data.json')
  .then(response => response.json())
  .then(json => { data = json; })
  .catch(err => console.error('加载数据出错:', err));

document.getElementById('searchBtn').addEventListener('click', searchData);

function searchData() {
  const projectVal = document.getElementById('projectSearch').value.trim().toLowerCase();
  const materialVal = document.getElementById('materialSearch').value.trim().toLowerCase();
  const supplierVal = document.getElementById('supplierSearch').value.trim().toLowerCase();
  const resultsContainer = document.getElementById('results');
  const noResults = document.getElementById('noResults');
  resultsContainer.innerHTML = '';

  const filtered = data.filter(item => {
    const projectMatch = projectVal === '' || (item['项目号'] && item['项目号'].toLowerCase().includes(projectVal));
    const materialMatch = materialVal === '' || (item['物料名称'] && item['物料名称'].toLowerCase().includes(materialVal));
    const supplierMatch = supplierVal === '' || (item['供应商名称'] && item['供应商名称'].toLowerCase().includes(supplierVal));
    return projectMatch && materialMatch && supplierMatch;
  });

  if (filtered.length === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      for (let key in item) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${key}:</strong> ${item[key]}`;
        card.appendChild(p);
      }
      resultsContainer.appendChild(card);
    });
  }
}