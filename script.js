// ==========================================
// 需要被紀錄的改裝品與資料 ID 列表
// ==========================================
const partIds = [
    'info-date', 'info-model', 'info-plate', 'info-engine',
    'brake-f-pump', 'brake-f-caliper', 'brake-f-disc',
    'brake-r-pump', 'brake-r-caliper', 'brake-r-disc',
    'ext-windshield', 'ext-carbon', 'ext-mirror', 'ext-f-fender', 'ext-r-fender', 'ext-in-fender',
    'tire-f', 'tire-r', 'wheel-f', 'wheel-r'
];

document.addEventListener('DOMContentLoaded', () => {
    // 網頁載入時，先載入車輛資料
    loadVehicleData();
    
    // 載入避震器未儲存的輸入框暫存 (保留離開格子的自動帶入功能)
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
// 1. 車輛資料與改裝清冊 (檢視/編輯切換)
// ==========================================

function loadVehicleData() {
    let hasData = false;

    partIds.forEach(id => {
        const savedValue = localStorage.getItem(id) || '';
        if (savedValue) hasData = true;

        // 將資料填入編輯框
        document.getElementById(id).value = savedValue;
        
        // 將資料填入檢視畫面
        const displayEl = document.getElementById('val-' + id);
        if (displayEl) {
            displayEl.innerText = savedValue !== '' ? savedValue : '-';
            displayEl.style.color = savedValue !== '' ? '#fff' : '#8e8e93';
        }
    });

    // 如果沒有任何資料，預設打開編輯模式
    if (!hasData) {
        toggleEditMode(true);
    } else {
        toggleEditMode(false);
    }
}

function saveVehicleData() {
    // 將編輯框的內容存入 localStorage
    partIds.forEach(id => {
        const value = document.getElementById(id).value;
        localStorage.setItem(id, value);
    });

    // 重新載入畫面並切換回檢視模式
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
        editBtn.classList.add('hidden'); // 在編輯模式隱藏右上角的編輯按鈕
    } else {
        viewSection.classList.remove('hidden');
        editSection.classList.add('hidden');
        editBtn.classList.remove('hidden');
    }
}


// ==========================================
// 2. 避震器多組設定存檔系統 (含文字廠牌)
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
            damper: document.getElementById('susp-f-damper').value || '原廠' // 支援廠牌文字
        },
        rear: {
            c: document.getElementById('susp-r-c').value || '-',
            r: document.getElementById('susp-r-r').value || '-',
            damper: document.getElementById('susp-r-damper').value || '原廠' // 支援廠牌文字
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
                        <strong style="color: var(--text-main); font-size: 13px;">前避震</strong>
                        <div><span>HSC</span> <span>${record.front.hsc}</span></div>
                        <div><span>LSC</span> <span>${record.front.lsc}</span></div>
                        <div><span>HSR</span> <span>${record.front.hsr}</span></div>
                        <div><span>LSR</span> <span>${record.front.lsr}</span></div>
                        <div style="margin-top:4px; border-top:1px dashed #333; padding-top:4px;"><span>阻尼</span> <span style="font-size:12px; text-align:right;">${record.front.damper}</span></div>
                    </div>
                    <div class="susp-col">
                        <strong style="color: var(--text-main); font-size: 13px;">後避震</strong>
                        <div><span>C</span> <span>${record.rear.c}</span></div>
                        <div><span>R</span> <span>${record.rear.r}</span></div>
                        <div style="margin-top:4px; border-top:1px dashed #333; padding-top:4px;"><span>阻尼</span> <span style="font-size:12px; text-align:right;">${record.rear.damper}</span></div>
                    </div>
                </div>
            </div>
        `;
    });
    historyContainer.innerHTML = htmlString;
}

// ==========================================
// 3. 油耗計算與歷程紀錄系統
// ==========================================
let fuelRecords = JSON.parse(localStorage.getItem('fuelRecords')) || [];

function saveFuelRecord() {
    const kmInput = document.getElementById('fuel-km').value;
    const litersInput = document.getElementById('fuel-liters').value;
    const typeInput = document.getElementById('fuel-type').value;
    const priceInput = document.getElementById('fuel-price').value;

    const km = parseFloat(kmInput);
    const liters = parseFloat(litersInput);
    const price = parseFloat(priceInput);

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
            alert(`錯誤：目前的總里程不能小於上次的總里程 (${lastKm}km)！`); return;
        }
    }

    const record = {
        date: new Date().toLocaleDateString('zh-TW'),
        km: km, liters: liters, type: typeInput || "未填寫",
        price: price || 0, consumption: consumptionText
    };

    fuelRecords.unshift(record);
    localStorage.setItem('fuelRecords', JSON.stringify(fuelRecords));
    
    document.getElementById('fuel-km').value = '';
    document.getElementById('fuel-liters').value = '';
    document.getElementById('fuel-price').value = '';
    
    renderFuelHistory();
}

function renderFuelHistory() {
    const historyContainer = document.getElementById('fuel-history');
    if (fuelRecords.length === 0) {
        historyContainer.innerHTML = '<p style="color: #8e8e93; font-size: 14px;">目前尚無紀錄。</p>'; return;
    }

    let htmlString = '';
    fuelRecords.forEach(record => {
        htmlString += `
            <div class="history-card">
                <div class="data-row">
                    <span style="color: #8e8e93;">${record.date}</span><span>${record.type}</span>
                </div>
                <div class="data-row">
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
