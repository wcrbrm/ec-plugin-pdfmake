import { Logger, getValue } from 'ec-react15-lib';

const PdfText = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfText').warn('Missing gen object');
    return false;
  }
  const value = getValue(props, 'value', context);
  const element = {};
  Logger.of('pdfmake.PdfText').info('gen=', gen);
  element.text = value || '';
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  if (props.fontSize) element.fontSize = props.fontSize;
  if (props.fontStyle) element[props.fontStyle] = true;
  if (props.textAlign) element.alignment = props.textAlign;
  if (props.color) element.color = props.color;
  if (props.margin) element.margin = props.margin;

  gen.addElement(element);

  return false;
};

export default PdfText;
