import { Logger, getValue } from 'ec-react15-lib';
import { getElementStyling } from './../../services/PdfStyles';

const PdfImage = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfImage').warn('Missing gen object'); return false;
  }
  const styles = getElementStyling(props, context);
  if (!styles) return false;

  const image = getValue(props, 'src', context);
  const element = { image };
  if (context.width) element.width = context.width;
  if (context.height) element.height = context.height;
  gen.addElement({ ...element, ...styles });
  return false;
};

export default PdfImage;
