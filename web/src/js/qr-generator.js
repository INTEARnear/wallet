import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
    width: 500,
    height: 500,
    image: "https://intea.rs/wallet-logo.svg",
    dotsOptions: {
        color: "#19a7fb",
        type: "classy-rounded",
        roundSize: false,
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: -10,
        imageSize: 0.5,
        saveAsBlob: true,
    },
    qrOptions: {
        errorCorrectionLevel: "M",
    },
    backgroundOptions: {
        color: "transparent",
    },
    cornersDotOptions: {
        type: "square",
    },
});

async function generateQRCode(data) {
    try {
        qrCode.update({ data });
        const blob = await qrCode.getRawData("png");
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw error;
    }
}

window.generateQRCode = generateQRCode;
