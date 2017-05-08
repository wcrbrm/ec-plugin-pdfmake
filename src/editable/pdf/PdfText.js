import { getValue } from 'ec-react15-lib';

const PdfText = ({ gen, props, context }) => {
  const value = getValue(props, 'value', context);
  const element = {};

  element.text = value;
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
