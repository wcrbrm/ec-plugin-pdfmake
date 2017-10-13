import { setValue, Logger } from 'ec-react15-lib';
import { getElementStyling } from './PdfStyles';

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
  setDocDefinition = (definition) => {
    this.doc = { ...this.doc, ...definition };
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
  getStyling = getElementStyling;
}

export default PdfMake;
