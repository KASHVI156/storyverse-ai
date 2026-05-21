import jsPDF from 'jspdf';

export function downloadStoryAsPdf({ title, text }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const margin = 36;
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title || 'Story Verse AI', margin, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const split = doc.splitTextToSize(text || '', pageWidth - margin * 2);

  let y = 70;
  const lineHeight = 14;

  split.forEach((line, i) => {
    if (y > 760) {
      doc.addPage();
      y = 50;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save(`${(title || 'story').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`);
}

