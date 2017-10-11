import { Logger, getValue, matchConditions } from 'ec-react15-lib';

const getTextInline = (props, context) => {
  const value = getValue(props, 'value', context);
  const element = {};
  if (props.display && props.display.conditions) {
    if (!matchConditions(props, props.display.conditions, context)) return {};
  }
  element.text = value || '';
  if (props.fontSize) element.fontSize = props.fontSize;
  if (props.fontStyle) element[props.fontStyle] = true;
  if (props.textAlign) element.alignment = props.textAlign;
  if (props.color) element.color = props.color;

  return element;
};

export const preprocessText = (props, context) => {
  const value = getValue(props, 'value', context);
  const element = {};

  if (Array.isArray(value)) {
    const text = [];
    value.forEach((el) => {
      text.push({ ...getTextInline(el, context) });
    });
    element.text = [text];
  } else {
    element.text = value || '';
  }

  if (props.display && props.display.conditions) {
    if (!matchConditions(props, props.display.conditions, context)) return {};
  }
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  if (props.fontSize) element.fontSize = props.fontSize;
  if (props.fontStyle) element[props.fontStyle] = true;
  if (props.textAlign) element.alignment = props.textAlign;
  if (props.color) element.color = props.color;

  return element;
};

const PdfText = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfText').warn('Missing gen object');
    return false;
  }
  Logger.of('pdfmake.PdfText').info('gen=', gen);
  const element = preprocessText(props, context);
  gen.addElement(element);

  return false;
};

export default PdfText;
