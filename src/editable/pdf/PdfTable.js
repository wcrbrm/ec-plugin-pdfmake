import { Logger, getValue } from 'ec-react15-lib';

const PdfTableRow = (props, context) => {
  const value = getValue(props, 'value', context);
  const element = {};
  element.text = value || '';
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  if (props.fontSize) element.fontSize = props.fontSize;
  if (props.fontStyle) element[props.fontStyle] = true;
  if (props.textAlign) element.alignment = props.textAlign;
  if (props.color) element.color = props.color;
  if (props.margin) element.margin = props.margin;
  return element;
};


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
  margin.push(marginLeft, marginTop, marginRight, marginBottom);
  const element = {};
  element.table = { body: [] };
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  if (props.layout) element.layout = props.layout;
  if (props.headerRows) element.table = { headerRows: props.headerRows };
  if (margin.length) element.margin = margin;
  if (props.body) {
    const body = [];
    props.body.forEach((rowTable, i) => {
      const row = [];
      rowTable.forEach((el) => {
        const newEl = PdfTableRow(el, context);
        row.push(newEl);
      });
      body[i] = row;
    });
    element.table.body = body;
  }

  gen.addElement(element);

  return false;
};

export default PdfTable;
