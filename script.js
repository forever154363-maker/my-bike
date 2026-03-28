// ==========================================
// 1. 自動儲存與讀取系統 (基礎填空自動存檔)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.auto-save');

    // 1. 讀取上次關閉網頁時留下的紀錄 (自動帶入上一次存檔內容)
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue) {
            input.value = savedValue;
        }

        // 2. 使用者修改後離開格子，自動存入草稿
        input.addEventListener('change', function() {
            localStorage.setItem(this.id, this.value);
        });
    });

    // 網頁載入時繪製歷史紀錄
    renderFuelHistory();
    renderSuspensionHistory();
});

// ==========================================
// 2. 避震器多組設定存檔系統
// ==========================================
let suspRecords = JSON.parse(localStorage.getItem('suspRecords')) || [];

function saveSuspensionRecord() {
    // 取得今天的日期 (格式: 月/日)
    const today = new Date();
    const dateString = (today.getMonth() + 1) + '/' + today.getDate();

    // 找出今天已經存了幾組設定
    const todayCount = suspRecords.filter(r => r.dateStr === dateString).length;
    // 產生專屬名稱 (例如: 3/20-1)
    const recordName = `${dateString}-${todayCount + 1}`;

    // 抓取畫面上目前的段數資料
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

    // 加到陣列最前面並存入手機
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
                        <div><span>阻尼</span> <span>${record.front.damper}</span></div>
                    </div>
                    <div class="susp-col">
                        <strong style="color: var(--text-main); font-size: 13px;">後避震</strong>
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

    let consumptionText = "首次紀錄，尚無油耗數據";

    if (fuelRecords.length > 0) {
        const lastKm = fuelRecords[0].km; 
        
        if (km > lastKm) {
            const kmDriven = km - lastKm;
            const kmPerLiter = (kmDriven / liters).toFixed(2);
            consumptionText = `${kmPerLiter} km/L`;
        } else if (km === lastKm) {
            alert("總里程與上次相同，請確認輸入是否正確。");
            return;
        } else {
            alert(`錯誤：目前的總里程不能小於上次的總里程 (${lastKm}km)！`);
            return;
        }
    }

    const record = {
        date: new Date().toLocaleDateString('zh-TW'),
        km: km,
        liters: liters,
        type: typeInput || "未填寫",
        price: price || 0,
        consumption: consumptionText
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
        historyContainer.innerHTML = '<p style="color: #8e8e93; font-size: 14px;">目前尚無紀錄。</p>';
        return;
    }

    let htmlString = '';
    
    fuelRecords.forEach(record => {
        htmlString += `
            <div class="history-card">
                <div class="data-row">
                    <span style="color: #8e8e93;">${record.date}</span>
                    <span>${record.type}</span>
                </div>
                <div class="data-row">
                    <span>總里程：${record.km} km</span>
                    <span>加了：${record.liters} L</span>
                </div>
                <div class="data-row">
                    <span>單價：$${record.price}</span>
                    <span>花費：$${Math.round(record.liters * record.price)}</span>
                </div>
                <div class="highlight">油耗表現：${record.consumption}</div>
            </div>
        `;
    });

    historyContainer.innerHTML = htmlString;
}