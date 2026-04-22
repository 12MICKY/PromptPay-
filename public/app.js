const form = document.getElementById("promptpay-form");
const targetValueInput = document.getElementById("targetValue");
const amountInput = document.getElementById("amount");
const statusText = document.getElementById("statusText");
const qrcodeContainer = document.getElementById("qrcode");
const ownerText = document.getElementById("ownerText");
const submitButton = form.querySelector('button[type="submit"]');
const STATUS_READY = "พร้อมใช้งาน";
const STATUS_LOADING = "กำลังเตรียมตัวสร้าง QR";

async function clearLegacyOfflineCache() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
  }
}

function sanitizeDigits(value) {
  return value.replace(/\D/g, "");
}

function detectType(value) {
  const digits = sanitizeDigits(value);

  if (digits.length === 10 && digits.startsWith("0")) {
    return "phone";
  }

  if (digits.length === 13) {
    return "nationalId";
  }

  throw new Error("เลข PromptPay ต้องเป็นเบอร์มือถือ 10 หลัก หรือเลขบัตร 13 หลัก");
}

function normalizePromptPayTarget(rawValue) {
  const digits = sanitizeDigits(rawValue);
  const type = detectType(digits);

  if (type === "phone") {
    return `0066${digits.slice(1)}`;
  }

  return digits;
}

function formatPromptPayLabel(rawValue) {
  const digits = sanitizeDigits(rawValue);

  if (!digits) {
    return "PromptPay ID";
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return digits;
}

function formatAmount(amount) {
  if (!amount) {
    return "";
  }

  const parsed = Number(amount);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error("จำนวนเงินไม่ถูกต้อง");
  }

  return parsed.toFixed(2);
}

function emvField(id, value) {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function crc16(payload) {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildPromptPayPayload(targetValue, amount) {
  const normalizedTarget = normalizePromptPayTarget(targetValue);
  const formattedAmount = formatAmount(amount);
  const merchantAccount = emvField(
    "29",
    emvField("00", "A000000677010111") + emvField("01", normalizedTarget)
  );

  const fields = [
    emvField("00", "01"),
    emvField("01", formattedAmount ? "12" : "11"),
    merchantAccount,
    emvField("52", "0000"),
    emvField("53", "764"),
  ];

  if (formattedAmount) {
    fields.push(emvField("54", formattedAmount));
  }

  fields.push(emvField("58", "TH"));
  fields.push(emvField("59", "PROMPTPAY"));
  fields.push(emvField("60", "BANGKOK"));

  const payloadWithoutCrc = `${fields.join("")}6304`;
  return `${payloadWithoutCrc}${crc16(payloadWithoutCrc)}`;
}

function renderQrCode(payload) {
  qrcodeContainer.innerHTML = "";

  new QRCode(qrcodeContainer, {
    text: payload,
    width: 440,
    height: 440,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function isQrLibraryReady() {
  return typeof window.QRCode !== "undefined";
}

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#ff8a80" : "#8b8685";
}

function generateQr() {
  try {
    if (!isQrLibraryReady()) {
      throw new Error("กำลังโหลดระบบสร้าง QR กรุณารอสักครู่");
    }

    const payload = buildPromptPayPayload(targetValueInput.value, amountInput.value);
    renderQrCode(payload);
    ownerText.textContent = formatPromptPayLabel(targetValueInput.value);
    setStatus("QR code contains your PromptPay ID");
  } catch (error) {
    qrcodeContainer.innerHTML = "";
    ownerText.textContent = formatPromptPayLabel(targetValueInput.value);
    setStatus(error.message || "สร้าง QR ไม่สำเร็จ", true);
  }
}

function hasRenderableInput() {
  return Boolean(sanitizeDigits(targetValueInput.value));
}

function maybeAutoGenerate() {
  ownerText.textContent = formatPromptPayLabel(targetValueInput.value);

  if (!hasRenderableInput()) {
    qrcodeContainer.innerHTML = "";
    setStatus(STATUS_READY);
    return;
  }

  if (!isQrLibraryReady()) {
    qrcodeContainer.innerHTML = "";
    setStatus(STATUS_LOADING);
    return;
  }

  generateQr();
}

function handleSubmit(event) {
  event.preventDefault();
  generateQr();
}

form.addEventListener("submit", handleSubmit);
targetValueInput.addEventListener("input", () => {
  maybeAutoGenerate();
});
amountInput.addEventListener("input", maybeAutoGenerate);
submitButton.classList.add("is-hidden");

window.addEventListener("load", () => {
  if (hasRenderableInput()) {
    maybeAutoGenerate();
  } else {
    setStatus(STATUS_READY);
  }
});

setStatus(STATUS_READY);
clearLegacyOfflineCache().catch(() => {
  setStatus(STATUS_READY);
});
