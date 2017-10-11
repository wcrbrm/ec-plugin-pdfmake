import { Logger, getValue } from 'ec-react15-lib';
import { preprocessText } from './PdfText';

const PdfTable = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfTable').warn('Missing gen object');
    return false;
  }
  const {
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0
  } = props;
  const margin = [];
  margin.push(marginTop, marginRight, marginBottom, marginLeft);

  const element = {};
  element.table = { body: [] };
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  if (props.layout) element.layout = props.layout;
  if (props.headerRows) element.table = { headerRows: props.headerRows };
  if (props.widths) element.table = { widths: props.widths };
  if (margin.length) element.margin = margin;
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
  }

  gen.addElement(element);

  return false;
};

export default PdfTable;
