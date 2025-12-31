import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPDF(
  elementId: string,
  filename: string,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Capture the element as canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  // Calculate PDF dimensions (A4)
  const imgWidth = 210; // mm
  const pageHeight = 297; // mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let heightLeft = imgHeight;
  let position = 0;

  // Add image to PDF (handle multi-page)
  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight,
  );
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
    );
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
