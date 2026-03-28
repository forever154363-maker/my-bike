// ==========================================
// 需要被紀錄的靜態改裝品與資料 ID 列表
// ==========================================
const partIds = [
    'info-date', 'info-model', 'info-plate', 'info-engine',
    'brake-f-pump', 'brake-f-caliper', 'brake-f-disc',
    'brake-r-pump', 'brake-r-caliper', 'brake-r-disc',
    'ext-windshield', 'ext-carbon', 'ext-mirror', 'ext-f-fender', 'ext-r-fender', 'ext-in-fender',
    'tire-f', 'tire-f-pt', 'tire-r', 'tire-r-pt', 'wheel-f', 'wheel-r',
    'susp-f-brand', 'susp-r-brand', 'damper-f-brand', 'damper-r-brand' // 新增硬體廠牌
];

let customExtData = JSON.parse(localStorage.getItem('customExtData')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // 網頁載入時，載入車輛資料與自訂外觀
    loadVehicleData();
    
    // 載入避震器純段數的暫存
    const suspInputs = document.querySelectorAll('#susp-f-hsc, #susp-f-lsc, #susp-f-hsr, #susp-f-lsr, #susp-f-damper, #susp-r-c, #susp-r-r, #susp-r-damper');
    suspInputs.forEach(input => {
        const savedValue = localStorage.getItem('draft-' + input.id);
        if (savedValue) input.value = savedValue;
        input.addEventListener('change', function() {
            localStorage.setItem('draft-' + this.id, this.value);
        });
    });

    // 繪製歷史紀錄
    renderFuelHistory();
    renderSuspensionHistory();
});

// ==========================================
// 1. 車輛資料與改裝清冊 (含自訂外觀)
// ==========================================

function loadVehicleData() {
    let hasData = false;

    // 載入靜態欄位
    partIds.forEach(id => {
        const savedValue = localStorage.getItem(id) || '';
        if (savedValue) hasData = true;

        document.getElementById(id).value = savedValue;
        
        const displayEl = document.getElementById('val-' + id);
        if (displayEl) {
            displayEl.innerText = savedValue !== '' ? savedValue : '-';
            displayEl.style.color = savedValue !== '' ? '#fff' : '#8e8e93';
        }
    });

    // 載入自訂外觀資料
    if (customExtData.length > 0) hasData = true;
    renderCustomExtEdit();
    renderCustomExtView();

    // 如果沒有任何資料，預設打開編輯模式
    toggleEditMode(!hasData);
}

function saveVehicleData() {
    // 儲存靜態欄位
    partIds.forEach(id => {
        const value = document.getElementById(id).value;
        localStorage.setItem(id, value);
    });

    // 儲存自訂外觀欄位
    customExtData = [];
    const customNames = document.querySelectorAll('.custom-ext-name');
    const customVals = document.querySelectorAll('.custom-ext-val');
    for (let i = 0; i < customNames.length; i++) {
        if (customNames[i].value.trim() !== '' || customVals[i].value.trim() !== '') {
            customExtData.push({
                name: customNames[i].value,
                val: customVals[i].value
            });
        }
    }
    localStorage.setItem('customExtData', JSON.stringify(customExtData));

    loadVehicleData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleEditMode(isEdit) {
    const viewSection = document.getElementById('view-section');
    const editSection = document.getElementById('edit-section');
    const editBtn = document.getElementById('btn-edit-mode');

    if (isEdit) {
        viewSection.classList.add('hidden');
        editSection.classList.remove('hidden');
        editBtn.classList.add('hidden');
    } else {
        viewSection.classList.remove('hidden');
        editSection.classList.add('hidden');
        editBtn.classList.remove('hidden');
    }
}

// === 自訂外觀部件邏輯 ===
function addCustomExt() {
    customExtData.push({ name: '', val: '' });
    renderCustomExtEdit();
}

function removeCustomExt(index) {
    customExtData.splice(index, 1);
    renderCustomExtEdit();
}

function renderCustomExtEdit() {
    const container = document.getElementById('custom-ext-container');
    container.innerHTML = '';
    customExtData.forEach((item, index) => {
        container.innerHTML += `
            <div class="input-group inline-input" style="margin-bottom: 15px; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px;">
                <input type="text" class="custom-ext-name" value="${item.name}" placeholder="部位 (例:定風翼)" style="width: 35%; border-bottom: 1px solid var(--border-color);">
                <input type="text" class="custom-ext-val" value="${item.val}" placeholder="廠牌型號" style="width: 50%; border-bottom: 1px solid var(--border-color);">
                <button class="text-btn" style="color: var(--accent); width: 10%; font-size: 18px;" onclick="removeCustomExt(${index})">✖</button>
            </div>
        `;
    });
}

function renderCustomExtView() {
    const listContainer = document.getElementById('val-custom-ext-list');
    listContainer.innerHTML = '';
    customExtData.forEach(item => {
        const nameText = item.name.trim() === '' ? '自訂部位' : item.name;
        const valText = item.val.trim() === '' ? '-' : item.val;
        const color = valText === '-' ? '#8e8e93' : '#fff';
        
        listContainer.innerHTML += `
            <div class="list-item">
                <span style="color: var(--accent);">${nameText}</span>
                <span class="val" style="color: ${color};">${valText}</span>
            </div>
        `;
    });
}


// ==========================================
// 2. 避震器純段數設定存檔系統
// ==========================================
let suspRecords = JSON.parse(localStorage.getItem('suspRecords')) || [];

function saveSuspensionRecord() {
    const today = new Date();
    const dateString = (today.getMonth() + 1) + '/' + today.getDate();
    const todayCount = suspRecords.filter(r => r.dateStr === dateString).length;
    const recordName = `${dateString}-${todayCount + 1}`;

    const record = {
        name: recordName,
        dateStr: dateString,
        fullTime: today.toLocaleTimeString('zh-TW', {hour: '2-digit', minute:'2-digit'}),
        front: {
            hsc: document.getElementById('susp-f-hsc').value || '-',
            lsc: document.getElementById('susp-f-lsc').value || '-',
            hsr: document.getElementById('susp-f-hsr').value || '-',
            lsr: document.getElementById('susp-f-lsr').value || '-',
            damper: document.getElementById('susp-f-damper').value || '-'
        },
        rear: {
            c: document.getElementById('susp-r-c').value || '-',
            r: document.getElementById('susp-r-r').value || '-',
            damper: document.getElementById('susp-r-damper').value || '-'
        }
    };

    suspRecords.unshift(record);
    localStorage.setItem('suspRecords', JSON.stringify(suspRecords));
    
    alert(`✅ 已儲存避震器設定：${recordName}`);
    renderSuspensionHistory();
}

function renderSuspensionHistory() {
    const historyContainer = document.getElementById('suspension-history');
    if (suspRecords.length === 0) {
        historyContainer.innerHTML = '<p style="color: #8e8e93; font-size: 14px;">目前尚無紀錄。</p>';
        return;
    }

    let htmlString = '';
    suspRecords.forEach(record => {
        htmlString += `
            <div class="history-card">
                <div class="susp-title">
                    設定代號：${record.name} <span style="font-size:12px; color:#8e8e93; float:right;">${record.fullTime}</span>
                </div>
                <div class="susp-grid">
                    <div class="susp-col">
                        <strong style="color: var(--text-main); font-size: 13px;">前避震段數</strong>
                        <div><span>HSC</span> <span>${record.front.hsc}</span></div>
                        <div><span>LSC</span> <span>${record.front.lsc}</span></div>
                        <div><span>HSR</span> <span>${record.front.hsr}</span></div>
                        <div><span>LSR</span> <span>${record.front.lsr}</span></div>
                        <div><span>阻尼</span> <span>${record.front.damper}</span></div>
                    </div>
                    <div class="susp-col">
                        <strong style="color: var(--text-main); font-size: 13px;">後避震段數</strong>
                        <div><span>C</span> <span>${record.rear.c}</span></div>
                        <div><span>R</span> <span>${record.rear.r}</span></div>
                        <div><span>阻尼</span> <span>${record.rear.damper}</span></div>
                    </div>
                </div>
            </div>
        `;
    });
    historyContainer.innerHTML = htmlString;
}

// ==========================================
// 3. 油耗計算與歷程紀錄系統 (新增修正功能)
// ==========================================
let fuelRecords = JSON.parse(localStorage.getItem('fuelRecords')) || [];

function saveFuelRecord() {
    const kmInput = document.getElementById('fuel-km').value;
    const litersInput = document.getElementById('fuel-liters').value;
    const typeInput = document.getElementById('fuel-type').value;
    const priceInput = document.getElementById('fuel-price').value;

    const km = parseFloat(kmInput);
    const liters = parseFloat(litersInput);
    const price = parseFloat(priceInput) || 0;

    if (!km || !liters) {
        alert("請至少輸入「總里程」與「加油量」來計算油耗！");
        return;
    }

    let consumptionText = "首次紀錄";
    if (fuelRecords.length > 0) {
        const lastKm = fuelRecords[0].km; 
        if (km > lastKm) {
            const kmDriven = km - lastKm;
            const kmPerLiter = (kmDriven / liters).toFixed(2);
            consumptionText = `${kmPerLiter} km/L`;
        } else if (km === lastKm) {
            alert("總里程與上次相同，請確認輸入是否正確。"); return;
        } else {
            alert(`錯誤：目前的總里程不能小於上次的總里程 (${lastKm}km)！若上筆紀錄填錯，請使用下方「修正」功能。`); return;
        }
    }

    const record = {
        date: new Date().toLocaleDateString('zh-TW'),
        km: km, liters: liters, type: typeInput || "未填寫",
        price: price, consumption: consumptionText
    };

    fuelRecords.unshift(record);
    localStorage.setItem('fuelRecords', JSON.stringify(fuelRecords));
    
    document.getElementById('fuel-km').value = '';
    document.getElementById('fuel-liters').value = '';
    document.getElementById('fuel-price').value = '';
    
    renderFuelHistory();
}

// 修正油耗紀錄 (抽出資料放回上方輸入框，並刪除該筆)
function editFuelRecord(index) {
    const record = fuelRecords[index];
    
    // 將資料放回輸入框
    document.getElementById('fuel-km').value = record.km;
    document.getElementById('fuel-liters').value = record.liters;
    document.getElementById('fuel-type').value = record.type === "未填寫" ? "" : record.type;
    document.getElementById('fuel-price').value = record.price === 0 ? "" : record.price;

    // 從歷史紀錄中移除
    fuelRecords.splice(index, 1);
    localStorage.setItem('fuelRecords', JSON.stringify(fuelRecords));
    
    renderFuelHistory();
    
    alert("資料已移至上方輸入框！請修改後重新點擊「新增油耗紀錄」。");
    // 讓畫面滾動回油耗輸入區
    window.scrollTo({ top: document.querySelector('.fuel-card').offsetTop - 50, behavior: 'smooth' });
}

function renderFuelHistory() {
    const historyContainer = document.getElementById('fuel-history');
    if (fuelRecords.length === 0) {
        historyContainer.innerHTML = '<p style="color: #8e8e93; font-size: 14px;">目前尚無紀錄。</p>'; return;
    }

    let htmlString = '';
    fuelRecords.forEach((record, index) => {
        htmlString += `
            <div class="history-card">
                <div class="data-row">
                    <span style="color: #8e8e93;">${record.date}</span>
                    <div>
                        <span style="margin-right: 10px;">${record.type}</span>
                        <button class="edit-fuel-btn" onclick="editFuelRecord(${index})">✏️ 修正</button>
                    </div>
                </div>
                <div class="data-row" style="margin-top: 5px;">
                    <span>里程：${record.km} km</span><span>${record.liters} L</span>
                </div>
                <div class="data-row">
                    <span>單價：$${record.price}</span><span>花費：$${Math.round(record.liters * record.price)}</span>
                </div>
                <div class="highlight">油耗表現：${record.consumption}</div>
            </div>
        `;
    });
    historyContainer.innerHTML = htmlString;
}
