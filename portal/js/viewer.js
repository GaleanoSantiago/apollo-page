// Elementos UI
const pdfViewer = document.getElementById('pdfViewer');
const loadingEl = document.getElementById('loadingMessage');
const contentEl = document.getElementById('actionPanel'); // O el contenedor principal
const titleEl = document.getElementById('contractTitle');
const clearBtn = document.getElementById('clearBtn');
const signBtn = document.getElementById('signBtn');
const canvas = document.getElementById('signature-pad');

// Variables OTP
let generatedOtp = null;
let tempSignatureData = null;
const otpModalEl = document.getElementById('otpModal');
const otpModal = new bootstrap.Modal(otpModalEl);
const otpInput = document.getElementById('otpInput');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

// Estado
const urlParams = new URLSearchParams(window.location.search);
const contractId = urlParams.get('id');
let signaturePad;
let contractData = null;
let currentUser = null;

// Inicialización
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        if(contractId) {
            loadContractData(contractId);
        } else {
            alert("No se especificó un contrato.");
            window.location.href = 'dashboard.html';
        }
    } else {
        window.location.href = 'index.html';
    }
});

function initSignaturePad() {
    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)'
    });

    // Resize canvas
    function resizeCanvas() {
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear();
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    clearBtn.addEventListener('click', () => signaturePad.clear());
}

// Lógica de Renderizado PDF (Con Auditoría y Firma)
async function renderPdf(pdfDataBytes, signatureBase64 = null, metadata = null) {
    try {
        console.log("Iniciando renderPdf...");
        if (signatureBase64 && metadata) {
            console.log("Generando PDF Firmado + Auditoría...");
            
            const pdfDoc = await PDFLib.PDFDocument.load(pdfDataBytes);
            const helveticaBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            const helvetica = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            const times = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);

            // 1. Estampar Firma (Última pág)
            const pages = pdfDoc.getPages();
            const lastPage = pages[pages.length - 1];
            
            const pngImageBytes = await fetch(signatureBase64).then(res => res.arrayBuffer());
            const signatureImageEmbed = await pdfDoc.embedPng(pngImageBytes);
            const { width, height } = signatureImageEmbed.scale(0.5);

            lastPage.drawImage(signatureImageEmbed, {
                x: 50,
                y: 50,
                width: width,
                height: height,
            });

            // 2. Hoja de Auditoría
            const auditPage = pdfDoc.addPage();
            const { width: pWidth, height: pHeight } = auditPage.getSize();

            auditPage.drawText('CERTIFICADO DE FIRMA DIGITAL', {
                x: 50, y: pHeight - 80, size: 24, font: helveticaBold
            });

            const drawField = (label, value, y) => {
                auditPage.drawText(label, { x: 50, y: y, size: 12, font: helveticaBold });
                auditPage.drawText(value, { x: 200, y: y, size: 12, font: helvetica });
            };

            let currentY = pHeight - 150;
            const lineHeight = 30;

            auditPage.drawText('Documento firmado mediante plataforma Apollo Portal.', {
                x: 50, y: currentY, size: 10, font: times
            });
            currentY -= 50;

            drawField('Firmado por:', metadata.clientEmail, currentY);
            currentY -= lineHeight;
            
            const dateStr = metadata.signedAt ? new Date(metadata.signedAt.seconds * 1000).toLocaleString() : 'Reciente';
            drawField('Fecha y Hora:', dateStr, currentY);
            currentY -= lineHeight;

            const method = metadata.verificationMethod === 'OTP_EMAIL' ? 'Validación OTP (Email)' : 'Simple';
            drawField('Método:', method, currentY);
            currentY -= lineHeight;

            drawField('ID Documento:', metadata.id, currentY);

            // Guardar HTML
            const signedPdfBytes = await pdfDoc.save();
            const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
            pdfViewer.src = URL.createObjectURL(blob); // Mostrar en iframe
            
            // Habilitar Descarga
            window.currentPdfBlob = blob;
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.classList.remove('d-none');
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(window.currentPdfBlob);
                link.download = `Contrato_Apollo_${metadata.id}.pdf`;
                link.click();
            };

            console.log("PDF Generado.");

        } else {
            console.log("Mostrando original.");
            const blob = new Blob([pdfDataBytes], { type: 'application/pdf' });
            pdfViewer.src = URL.createObjectURL(blob);
        }
    } catch (e) {
        console.error("Render error:", e);
        alert("Error renderizando el PDF.");
    }
}

// Cargar Datos
async function loadContractData(id) {
    try {
        const docRef = db.collection("contracts").doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            contractData = docSnap.data();
            contractData.id = docSnap.id;

            if (contractData.clientEmail !== currentUser.email) {
                alert("No autorizado.");
                window.location.href = 'dashboard.html';
                return;
            }

            titleEl.textContent = contractData.title;

            // Descargar PDF (tratando de evitar CORS usando fetch simple, si falla, fallback)
            let pdfBytes;
            try {
                const res = await fetch(contractData.pdfUrl);
                if(!res.ok) throw new Error("Network response not ok");
                pdfBytes = await res.arrayBuffer();
            } catch(e) {
                console.warn("CORS/Fetch error, intentando cargar PDF dummy o mostrando error.");
                // Fallback: crear PDF vacío con mensaje error
                const pdfDoc = await PDFLib.PDFDocument.create();
                const page = pdfDoc.addPage();
                page.drawText('No se pudo cargar el PDF original (Error CORS/Red).', {x:50, y:700});
                pdfBytes = await pdfDoc.save();
            }

            // Renderizar
            if(contractData.status === 'signed' && contractData.signatureData) {
                await renderPdf(pdfBytes, contractData.signatureData, contractData);
                signBtn.disabled = true;
                signBtn.innerHTML = '<i class="fas fa-check"></i> Firmado';
                signBtn.className = 'btn btn-success';
                canvas.style.display = 'none'; // Ocultar canvas si ya firmó
            } else {
                await renderPdf(pdfBytes, null, null);
                initSignaturePad();
            }

            loadingEl.style.display = 'none';

        } else {
            alert("No encontrado.");
            window.location.href = 'dashboard.html';
        }
    } catch(e) {
        console.error(e);
        loadingEl.textContent = "Error al cargar.";
    }
}

// Lógica OTP
async function sendOtpEmail(email, code) {
    console.log(`[SIMULACIÓN] Código OTP para ${email}: ${code}`);
    // AQUÍ INTEGRACIÓN EMAILJS REAL
    // return emailjs.send("...", "...", {...});
    return Promise.resolve();
}

signBtn.addEventListener('click', async () => {
    if (signaturePad.isEmpty()) {
        alert("Por favor firme primero.");
        return;
    }

    // CAPTURAR FIRMA INSTANTÁNEAMENTE
    tempSignatureData = signaturePad.toDataURL();
    console.log("Firma capturada.");

    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    signBtn.disabled = true;
    signBtn.innerHTML = 'Enviando código...';

    try {
        await sendOtpEmail(currentUser.email, generatedOtp);
        userEmailDisplay.textContent = currentUser.email;
        otpInput.value = '';
        otpModal.show();
        signBtn.innerHTML = 'Firma Pendiente...';
    } catch (e) {
        console.error(e);
        signBtn.disabled = false;
        signBtn.innerHTML = 'Intentar de nuevo';
    }
});

verifyOtpBtn.addEventListener('click', async () => {
    const code = otpInput.value.trim();
    if(code !== generatedOtp) {
        alert("Código incorrecto.");
        return;
    }

    otpModal.hide();
    
    // GUARDAR
    verifyOtpBtn.disabled = true;
    verifyOtpBtn.innerHTML = 'Guardando...';

    try {
        if(!tempSignatureData) throw new Error("Firma perdida.");

        await db.collection("contracts").doc(contractId).update({
            status: 'signed',
            signedAt: new Date(),
            signatureData: tempSignatureData, 
            signatureIp: 'IP_PENDING',
            verificationMethod: 'OTP_EMAIL'
        });

        alert("¡Firmado correctamente!");
        window.location.reload();
    } catch(e) {
        console.error(e);
        alert("Error guardando: " + e.message);
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.innerHTML = 'Verificar y Firmar';
    }
});
