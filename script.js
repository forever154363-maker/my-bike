:root {
    --bg-color: #000000;
    --card-bg: #1c1c1e;
    --text-main: #ffffff;
    --text-muted: #8e8e93;
    --accent: #ff453a; 
    --accent-blue: #0a84ff; 
    --border-color: #38383a;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0; padding: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: safe-area-inset-bottom;
}

header { padding: 50px 20px 10px; background-color: var(--bg-color); }
h1 { margin: 0; font-size: 32px; font-weight: 700; }
.container { padding: 0 16px 40px; }

/* 封面照片 */
.photo-card {
    background-color: var(--card-bg);
    border-radius: 14px;
    margin-bottom: 20px; margin-top: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(255, 69, 58, 0.15);
    border: 1px solid var(--border-color);
    aspect-ratio: 16 / 9; 
    display: flex; align-items: center; justify-content: center;
}
#cover-photo { width: 100%; height: 100%; object-fit: cover; display: block; }

.section-header {
    font-size: 14px; color: var(--text-muted);
    text-transform: uppercase;
    margin: 24px 0 8px 16px; font-weight: 600;
}

.card {
    background-color: var(--card-bg);
    border-radius: 10px; padding: 16px;
    margin-bottom: 16px; border: 1px solid var(--border-color);
}
.section-title { margin-top: 0; margin-bottom: 16px; font-size: 18px; color: var(--accent); }

/* 原生折疊選單設計 (編輯模式用) */
.accordion-card {
    background-color: var(--card-bg);
    border-radius: 10px; margin-bottom: 12px;
    overflow: hidden; border: 1px solid var(--border-color);
}
summary {
    padding: 16px; font-size: 17px; font-weight: 600;
    cursor: pointer; list-style: none; position: relative;
}
summary::-webkit-details-marker { display: none; }
summary::after {
    content: '+'; position: absolute; right: 16px;
    color: var(--accent); font-size: 20px; font-weight: bold;
}
details[open] summary::after { content: '-'; }
details[open] summary { border-bottom: 1px solid var(--border-color); }
.accordion-content { padding: 16px; }
.accordion-content h3 {
    margin: 16px 0 8px 0; font-size: 15px; color: var(--accent);
    border-bottom: 1px solid var(--border-color); padding-bottom: 4px;
}

/* 輸入框 */
.input-group {
    display: flex; flex-direction: column;
    margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;
}
.input-group:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.input-group label { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
input {
    background-color: transparent; border: none;
    color: var(--text-main); font-size: 17px; width: 100%; padding: 4px 0;
}
input:focus { outline: none; }

/* 檢視模式清單 (iOS 設定風格) */
.list-view { padding: 0; overflow: hidden; }
.list-group { border-bottom: 8px solid #000; }
.list-group:last-child { border-bottom: none; }
.list-group h3 {
    margin: 0; padding: 12px 16px 8px; font-size: 13px;
    color: var(--text-muted); text-transform: uppercase; background-color: #121212;
}
.list-item {
    display: flex; justify-content: space-between;
    padding: 14px 16px; border-bottom: 1px solid var(--border-color);
    font-size: 16px;
}
.list-item:last-child { border-bottom: none; }
.list-item .val { color: var(--text-main); font-weight: 500; text-align: right; max-width: 60%; }

/* 隱藏區塊 */
.hidden { display: none !important; }

/* 文字按鈕 */
.text-btn {
    background: none; border: none; color: var(--accent-blue);
    font-size: 15px; font-weight: bold; cursor: pointer; padding: 0;
}

/* 避震器專用 */
.inline-input { flex-direction: row; justify-content: space-between; align-items: center; }
.inline-input label { margin-bottom: 0; font-size: 16px; color: var(--text-main); }
.susp-num {
    width: 60px; text-align: right; color: var(--accent);
    font-weight: bold; border-bottom: 1px solid var(--border-color); margin-right: 4px;
}

/* 按鈕與紀錄區 */
.action-btn {
    background-color: var(--accent); color: #fff; border: none;
    padding: 14px; font-size: 17px; border-radius: 10px;
    cursor: pointer; font-weight: 600; width: 100%; margin-top: 10px;
}
.susp-btn { background-color: var(--accent-blue); margin-top: 20px; margin-bottom: 10px; }
.history-section { margin-top: 24px; }
.history-section h4 { margin: 0 0 12px 0; color: var(--text-muted); font-size: 15px; }
.history-card {
    background-color: #000; border: 1px solid var(--border-color);
    padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 14px;
}
.history-card .data-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.history-card .highlight {
    color: var(--accent); font-size: 16px; font-weight: bold;
    margin-top: 8px; border-top: 1px dashed var(--border-color); padding-top: 8px;
}
.susp-title {
    color: var(--accent-blue); font-weight: bold; font-size: 16px;
    border-bottom: 1px dashed var(--border-color); padding-bottom: 6px; margin-bottom: 8px;
}
.susp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.susp-col { background-color: #121212; padding: 8px; border-radius: 6px; }
.susp-col div { display: flex; justify-content: space-between; margin-bottom: 2px; color: #d1d1d6; }
