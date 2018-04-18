import { Logger, getValue } from 'ec-react15-lib';
import { preprocessText } from './PdfText';
import { getElementStyling } from './../../services/PdfStyles';

const PdfTable = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfTable').warn('Missing gen object');
    return false;
  }
  const styles = getElementStyling(props, context);
  if (!styles) return false;
  const element = {};
  element.table = { body: [] };
  if (context.pageBreak) element.pageBreak = context.pageBreak;

  if (props.body) {
    const body = [];
    props.body.forEach((row, i) => {
      const rowContent = [];
      row.forEach((col) => {
        if (col.type === 'PdfText') {
          const newCol = preprocessText(col, context);
          rowContent.push(newCol);
        }
      });
      body[i] = rowContent;
    });
    element.table.body = body;
    if (styles.widths) element.table.widths = styles.widths;
    if (styles.headerRows) element.table.headerRows = styles.headerRows;
    // if (!styles.body) {
    //   Logger.of('pdfmake.PdfTable').warn('Missing styles.body from element', JSON.stringify(element));
    //   return false;
    // }
    gen.addElement({ ...element, ...styles });
  }

  return false;
};

export default PdfTable;
