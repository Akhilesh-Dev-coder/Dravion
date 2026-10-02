const fs = require("fs");
const path = require("path");

async function downloadPdfJs() {
  const dir = path.join(process.cwd(), "public", "pdfjs");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const jsUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const workerUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  console.log("Downloading PDF.js to public/pdfjs/...");

  const resJs = await fetch(jsUrl);
  const jsText = await resJs.text();
  fs.writeFileSync(path.join(dir, "pdf.min.js"), jsText);
  console.log("Downloaded pdf.min.js (" + jsText.length + " bytes)");

  const resWorker = await fetch(workerUrl);
  const workerText = await resWorker.text();
  fs.writeFileSync(path.join(dir, "pdf.worker.min.js"), workerText);
  console.log("Downloaded pdf.worker.min.js (" + workerText.length + " bytes)");
}

downloadPdfJs().catch(console.error);
