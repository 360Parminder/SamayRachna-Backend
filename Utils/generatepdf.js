const PDFDocument = require('pdfkit');
const fs = require('fs');

function generatePDF(timetableData, fileName = 'timetable.pdf') {
    const doc = new PDFDocument({ margin: 30 });
    const stream = fs.createWriteStream("uploads/pdf/" + fileName);
    doc.pipe(stream);

    // Title
    doc.fontSize(18).text(timetableData.name, { align: 'center' });
    doc.moveDown(1);

    timetableData.timetable.forEach(dayData => {
        const day = `Day ${dayData[0].day}`;

        // Day header
        doc.fontSize(14).font('Helvetica-Bold').text(day, { underline: true });
        doc.moveDown(0.5);

        // Table header
        const tableHeader = ["Lecture", "Subject", "Teacher"];
        const columnWidths = [80, 200, 200];

        drawTableRow(doc, tableHeader, columnWidths, true);

        // Table content
        dayData.forEach(lecture => {
            const row = [lecture.lecture, lecture.subject, lecture.teacher];
            drawTableRow(doc, row, columnWidths);
        });

        doc.moveDown(1);
    });

    // Finalize the PDF
    doc.end();

    stream.on('finish', () => {
        console.log(`PDF saved as ${fileName}`);
    });
    return {
        filePath: `uploads/pdf/${fileName}`,
    }
}

function drawTableRow(doc, row, columnWidths, isHeader = false) {
    const cellPadding = 5;
    const yStart = doc.y;
    let x = doc.page.margins.left; // Start from the left margin

    row.forEach((cell, i) => {
        const cellWidth = columnWidths[i];
        const cellHeight = 20;

        // Draw cell background for header
        if (isHeader) {
            doc.rect(x, yStart, cellWidth, cellHeight).fill('#f0f0f0');
        }

        // Draw cell border
        doc.rect(x, yStart, cellWidth, cellHeight).stroke();

        // Draw text
        doc.fillColor(isHeader ? 'black' : 'black')
            .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
            .fontSize(10)
            .text(cell, x + cellPadding, yStart + cellPadding, { width: cellWidth - 2 * cellPadding, height: cellHeight - 2 * cellPadding, align: 'left' });

        x += cellWidth;
    });

    // Move to next row
    doc.y = yStart + 20;
    
}

module.exports = {
    generatePDF
};
