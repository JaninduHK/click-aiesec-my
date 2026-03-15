"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeModalProps {
  url: string;
  slug: string;
  onClose: () => void;
}

export default function QRCodeModal({ url, slug, onClose }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      }).then(() => {
        setDataUrl(canvasRef.current!.toDataURL("image/png"));
      });
    }
  }, [url]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${slug}.png`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-black dark:text-white">QR Code</h3>
          <button
            onClick={onClose}
            className="text-bodydark hover:text-danger"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7535 4.24648L9.00002 8.99998L4.24652 4.24648L3.18652 5.30648L7.94002 9.05998L3.18652 13.8135L4.24652 14.8735L9.00002 10.12L13.7535 14.8735L14.8135 13.8135L10.06 9.05998L14.8135 5.30648L13.7535 4.24648Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <p className="mb-4 text-sm text-bodydark break-all">{url}</p>

        <div className="flex justify-center mb-6">
          <canvas ref={canvasRef} />
        </div>

        <button
          onClick={handleDownload}
          disabled={!dataUrl}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
