import { setValue, Logger } from 'ec-react15-lib';
import { getElementStyling } from './PdfStyles';

class PdfMake {

  // contructor can accept library - when running in server-side mode
  constructor(pdfPrinter) {
    Logger.of('pdfmake.constructor').info('initialized', typeof pdfPrinter);
    this.pdfPrinter = pdfPrinter;
    if (!this.pdfPrinter && typeof window !== 'undefined' && typeof window.pdfMake !== 'undefined') {
      this.pdfPrinter = window.pdfMake;
    }
    this.pdfPrinter.fonts = {
      SourceSansPro: {
        normal: 'SourceSansPro-Regular.ttf',
        bold: 'SourceSansPro-Bold.ttf',
        italics: 'SourceSansPro-Italic.ttf',
        bolditalics: 'SourceSansPro-BoldItalic.ttf'
      }
    };
  }

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
        this.pdfPrinter.createPdf(doc).getBase64((res) => {
          setValue(`g:${pdfTarget}`, `data:application/pdf;base64,${res}`, context);
        });
      } else {
        this.pdfPrinter.createPdf(doc).download(pdfTarget);
      }
    } else {
      this.pdfPrinter.createPdf(doc).download('output.pdf');
    }
    return true;
  };
  getStyling = getElementStyling;
}

export default PdfMake;
