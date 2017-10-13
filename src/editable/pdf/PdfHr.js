import { Logger } from 'ec-react15-lib';
import { getElementStyling } from './../../services/PdfStyles';

const PdfHr = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfHr').warn('Missing gen object');
    return false;
  }
  const styles = getElementStyling(props, context);
  if (!styles) return false;

  const { margins = [5, 0, 0, 0] } = styles;
  const width = context.width || 500;

  const element = {
    canvas: [
      {
        type: 'line',
        x1: margins[3] || 0,
        y1: margins[0] || 0,
        x2: width - (margins[3] || 0),
        y2: margins[0] || 0,
        lineWidth: props.lineHeight || 0.5,
        lineColor: props.lineColor || 'black',
        dash: { length: props.dash || 0 }
      }
    ]
  };
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  gen.addElement(element);
  return false;
};

export default PdfHr;
