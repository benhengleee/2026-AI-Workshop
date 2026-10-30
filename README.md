# 2026 AI 工作坊

活動報名網站。頁面已依照需求設計為三列排版：標題、活動圖片、活動內容與報名表單。

## GitHub Pages

正式網站：

- https://benhengleee.github.io/2026-AI-Workshop/

## Google Apps Script

- 報名服務：[Google Apps Script Web App](https://script.google.com/macros/s/AKfycbw2vHhnTrMAtJTT4UZs9NkJazGzLzsD8valt9n7rzXaERZGLEn0TatuafNC8w5qH7g1JA/exec)
- 服務以部署者身分執行，並允許任何人存取，供 GitHub Pages 表單提交使用。
- 試算表會以 `2026 AI 工作坊` 命名，首列為標題，電話欄設定為文字格式。
- 若需重新部署，請在 Apps Script 編輯器執行 `initializeSpreadsheet`，完成授權後部署為「網頁應用程式」。

## 站點內容

- 活動名稱：2026 AI 工作坊
- 封面圖片：cover.jpg
- 表單欄位：姓名、Email、單位、電話、職稱

## 部署方式

1. GitHub Repository：`2026-AI-Workshop`（GitHub 不接受工作坊名稱中的空格與中文字作為 Repo 名稱）
2. GitHub Pages 從 `main` 分支根目錄發布
3. `spec` 資料夾不會推送到 GitHub
