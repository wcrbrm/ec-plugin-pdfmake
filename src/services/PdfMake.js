import { setValue } from 'ec-react15-lib';

class PdfGenerator {
  doc = {
    pageSize: 'A4',
    content: [],
    defaultStyle: {
      font: 'SourceSansPro'
    }
  };
  margin = { left: 5, top: 5, right: 5, bottom: 5 };

  addElement = (element) => {
    this.doc.content.push(element);
  };

  finish = (pdfTarget, context) => {
    const doc = JSON.parse(JSON.stringify(this.doc));
    pdfMake.fonts = {
      SourceSansPro: {
        normal: 'SourceSansProLight.ttf',
        bold: 'SourceSansProBold.ttf',
        italics: 'SourceSansProLight.ttf'
      }
    };

    if (pdfTarget) {
      if (pdfTarget === '_blank') {
        pdfMake.createPdf(doc).open();
      }
      const file = pdfTarget || 'print-version';
      if (file.indexOf('.pdf') === -1) {
        pdfMake.createPdf(doc).getBase64((res) => {
          setValue(`g:${pdfTarget}`, 'data:application/pdf;base64,' + res, context);
        });
      } else {
        pdfMake.createPdf(doc).download(pdfTarget);
      }
    } else {
      pdfMake.createPdf(doc).download('output.pdf');
    }
    return true;
  };
}

export default PdfGenerator;
