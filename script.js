const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2vHhnTrMAtJTT4UZs9NkJazGzLzsD8valt9n7rzXaERZGLEn0TatuafNC8w5qH7g1JA/exec";

const form = document.getElementById("registerForm");
const statusBox = document.getElementById("formStatus");
const submitButton = form.querySelector("button[type='submit']");

let activeRequestId = null;
let activeFrame = null;
let requestTimeoutId = null;

function setStatus(message, type) {
  statusBox.textContent = message;
  statusBox.classList.remove("success", "error");
  if (type) {
    statusBox.classList.add(type);
  }
}

function finishRequest(success, message) {
  window.clearTimeout(requestTimeoutId);
  activeRequestId = null;

  if (activeFrame) {
    activeFrame.remove();
    activeFrame = null;
  }

  submitButton.disabled = false;
  submitButton.textContent = "送出報名";
  setStatus(message, success ? "success" : "error");

  if (success) {
    form.reset();
  }
}

window.addEventListener("message", function (event) {
  if (!activeRequestId || !event.data || event.data.type !== "registration-result") {
    return;
  }

  if (event.data.requestId !== activeRequestId) {
    return;
  }

  if (event.origin !== "null") {
    const hostname = new URL(event.origin).hostname;
    if (hostname !== "script.google.com" &&
        hostname !== "script.googleusercontent.com" &&
        !hostname.endsWith(".googleusercontent.com")) {
      return;
    }
  }

  finishRequest(
    event.data.success === true,
    event.data.message || "報名失敗，請稍後再試。"
  );
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (GOOGLE_APPS_SCRIPT_URL === "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE") {
    setStatus("請先部署 Google Apps Script，並將實際 Web App URL 填入 script.js。", "error");
    return;
  }

  const requestId = window.crypto.randomUUID();
  const payload = {
    requestId: requestId,
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    unit: document.getElementById("unit").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    title: document.getElementById("title").value.trim(),
  };

  activeRequestId = requestId;
  activeFrame = document.createElement("iframe");
  activeFrame.name = `registration-response-${requestId}`;
  activeFrame.title = "報名送出回覆";
  activeFrame.hidden = true;
  document.body.appendChild(activeFrame);

  const requestForm = document.createElement("form");
  requestForm.method = "POST";
  requestForm.action = GOOGLE_APPS_SCRIPT_URL;
  requestForm.target = activeFrame.name;

  const payloadInput = document.createElement("input");
  payloadInput.type = "hidden";
  payloadInput.name = "payload";
  payloadInput.value = JSON.stringify(payload);
  requestForm.appendChild(payloadInput);
  document.body.appendChild(requestForm);

  submitButton.disabled = true;
  submitButton.textContent = "送出中...";
  setStatus("正在送出報名資料...", "");

  requestTimeoutId = window.setTimeout(function () {
    finishRequest(
      false,
      "服務未回覆。請先確認試算表是否已有資料，再決定是否重送。"
    );
  }, 45000);

  requestForm.submit();
  requestForm.remove();
});
