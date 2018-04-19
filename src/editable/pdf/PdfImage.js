import { Logger, getValue } from 'ec-react15-lib';
import { getElementStyling } from './../../services/PdfStyles';

const scaleSize = (origin, scaleValue) => {
  const scale = scaleValue.split('%')[0];
  if (!isNaN(scale) && origin) { // eslint-disable-line
    return (origin * scale) / 100;
  }
  return origin;
};

const updateSize = (origin, fit) => {
  const x = fit[0] || '100%';
  const y = fit[1] || '100%';
  const newX = (x.indexOf('%') > 0) ? scaleSize(origin[0], x) : x;
  const newY = (y.indexOf('%') > 0) ? scaleSize(origin[1], y) : y;
  return [newX, newY];
};

const PdfImage = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfImage').warn('Missing gen object'); return false;
  }
  const styles = getElementStyling(props, context);
  if (!styles) return false;

  const image = getValue(props, 'src', context);
  if (image.indexOf('data:image/') !== 0) {
    Logger.of('pdfmake.PdfImage').warn('Images should contain dataURL entries (or local file paths in node.js)');
    return false;
  }
  if (!image) return false;

  const element = { image };

  const fit = getValue(props, 'fit', context, false);
  if (fit && fit.length && context.width) {
    const origin = [context.width, context.height];
    const newFit = updateSize(origin, fit);
    if (newFit[0]) element.width = newFit[0]; // eslint-disable-line
    if (newFit[1]) element.height = newFit[1]; // eslint-disable-line
  } else {
    if (context.width) element.width = context.width;
    if (context.height) element.height = context.height;
  }
  gen.addElement({ ...element, ...styles });
  return false;
};

export default PdfImage;

