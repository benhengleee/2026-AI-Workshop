# 2026 AI 工作坊

活動報名網站。頁面已依照需求設計為三列排版：標題、活動圖片、活動內容與報名表單。

## GitHub Pages

正式網站：

- https://benhengleee.github.io/2026-AI-Workshop/

## Google Apps Script

1. 在 Apps Script 編輯器執行 `initializeSpreadsheet`，並完成 Google 授權。
2. 部署為 Web 應用程式，設定為「以部署者身分執行」並允許任何人存取。
3. 將 Web App URL 填入 `script.js` 的 `GOOGLE_APPS_SCRIPT_URL`。
4. 試算表會以 `2026 AI 工作坊` 命名，首列為標題，電話欄設定為文字格式。

## 站點內容

- 活動名稱：2026 AI 工作坊
- 封面圖片：cover.jpg
- 表單欄位：姓名、Email、單位、電話、職稱

## 部署方式

1. GitHub Repository：`2026-AI-Workshop`（GitHub 不接受工作坊名稱中的空格與中文字作為 Repo 名稱）
2. GitHub Pages 從 `main` 分支根目錄發布
3. `spec` 資料夾不會推送到 GitHub
