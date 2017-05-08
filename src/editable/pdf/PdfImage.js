import { getValue } from 'ec-react15-lib';

const PdfImage = ({ gen, props, context }) => {
  const image = getValue(props, 'src', context);
  const element = { image };
  if (context.width) element.width = context.width;
  if (context.height) element.height = context.height;
  gen.addElement(element);
  return false;
};

export default PdfImage;
