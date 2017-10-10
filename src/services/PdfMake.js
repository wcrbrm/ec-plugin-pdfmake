import { setValue, Logger } from 'ec-react15-lib';

pdfMake.fonts = {
  SourceSansPro: {
    normal: 'SourceSansPro-Regular.ttf',
    bold: 'SourceSansPro-Bold.ttf',
    italics: 'SourceSansPro-Italic.ttf',
    bolditalics: 'SourceSansPro-BoldItalic.ttf'
  }
};

class PdfMake {
  doc = {
    pageSize: 'A4',
    content: [],
    defaultStyle: {
      font: 'SourceSansPro'
    }
  };
  margin = {
    left: 5,
    top: 5,
    right: 5,
    bottom: 5
  };
  addElement = (element) => {
    this.doc.content.push(element);
  };
  finish = (pdfTarget, context) => {
    const doc = JSON.parse(JSON.stringify(this.doc));
    Logger.of('pdfmake.finish').info('doc=', doc);
    if (pdfTarget) {
      const file = pdfTarget || 'print-version';
      if (file.indexOf('.pdf') === -1) {
        pdfMake.createPdf(doc).getBase64((res) => {
          setValue(`g:${pdfTarget}`, `data:application/pdf;base64,${res}`, context);
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

export default PdfMake;
