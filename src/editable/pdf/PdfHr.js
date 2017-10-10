import { Logger } from 'ec-react15-lib';

const PdfHr = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfHr').warn('Missing gen object');
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
  const element = {
    canvas: [
      {
        type: 'line',
        x1: margin[3] || 0,
        y1: margin[0] || 0,
        x2: 500 - (margin[3] || 0),
        y2: margin[0] || 0,
        lineWidth: props.lineHeight || 0.5,
        lineColor: props.lineColor || 'black'
      }
    ]
  };
  if (context.pageBreak) element.pageBreak = context.pageBreak;
  gen.addElement(element);
  return false;
};

export default PdfHr;
