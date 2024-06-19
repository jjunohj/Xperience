"use client";

import { toPng } from "html-to-image";

const PrintButton = () => {
  const handlePrint = () => {
    if (!document) return;
    toPng(document.getElementById("resume"), {
      quality: 0.95,
      backgroundColor: "#ffffff",
      width: 1120,
      height: 3200,
    }).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "resume.png";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <button
      className="fixed bottom-10 right-10 bg-gray-800 text-white p-2 rounded-full"
      onClick={handlePrint}
    >
      Print
    </button>
  );
};

export default PrintButton;
