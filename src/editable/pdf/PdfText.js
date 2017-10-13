import { Logger, getValue } from 'ec-react15-lib';
import { getElementStyling } from './../../services/PdfStyles';

const getTextInline = (props, context) => {
  const styles = getElementStyling(props, context);
  if (!styles) return false;

  const value = getValue(props, 'value', context);
  const element = {};
  element.text = value || '';
  return { ...element, ...styles };
};

export const preprocessText = (props, context) => {
  const styles = getElementStyling(props, context);
  if (!styles) return false;

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

  if (context.pageBreak) element.pageBreak = context.pageBreak;

  return { ...element, ...styles };
};

const PdfText = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfText').warn('Missing gen object');
    return false;
  }
  const styles = getElementStyling(props, context);
  if (!styles) return false;

  Logger.of('pdfmake.PdfText').info('gen=', gen);
  const element = preprocessText(props, context);
  gen.addElement(element);

  return false;
};

export default PdfText;
