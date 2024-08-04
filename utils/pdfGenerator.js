const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (data, filePath) => {
  return new Promise(async (resolve, reject) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc.fontSize(25)
      .fillColor('blue')
      .text('Products List', { align: 'center', underline: true });

    doc.moveDown(2);

    // Table header
    const tableTop = doc.y;
    const itemTitleX = 50;
    const itemSKUX = 165;
    const itemCategoryX = 300;
    const itemQuantityX = 400;
    const itemPriceX = 500;

    doc.fontSize(14)
      .fillColor('black')
      .text('Name', itemTitleX, tableTop, { bold: true })
      .text('SKU', itemSKUX, tableTop, { bold: true })
      .text('Category', itemCategoryX, tableTop, { bold: true })
      .text('Quantity', itemQuantityX, tableTop, { bold: true })
      .text('Price', itemPriceX, tableTop, { bold: true });

    const separatorY = doc.y + 10;
    doc.moveTo(50, separatorY)
      .lineTo(550, separatorY)
      .strokeColor('black')
      .lineWidth(2)
      .stroke();

    let yPosition = separatorY + 15;

    // Add watermark
    const watermarkPath = path.join(__dirname,  'logo.png');
    const watermarkOptions = {
      fit: [400, 400],
      align: 'center',
      valign: 'center',
      opacity: 0.1,
    };

    // Table rows
    data.forEach((product, index) => {
      if (index % 10 === 0) {
        if (index > 0) {
          doc.addPage();
        }
        doc.image(watermarkPath, { ...watermarkOptions, x: 100, y: 200 });
      }
      doc.fontSize(12)
        .fillColor('black')
        .text(product.name, itemTitleX, yPosition)
        .text(product.sku, itemSKUX, yPosition)
        .text(product.category, itemCategoryX, yPosition)
        .text(product.quantity, itemQuantityX, yPosition)
        .text(product.price, itemPriceX, yPosition);

      yPosition += 30;

      // Draw row separator
      doc.moveTo(50, yPosition)
        .lineTo(550, yPosition)
        .strokeColor('gray')
        .lineWidth(1)
        .stroke();

      yPosition += 10;
    });

    // Footer
    doc.moveDown();

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = { generatePDF };
