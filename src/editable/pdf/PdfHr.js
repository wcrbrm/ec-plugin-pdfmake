const PdfHr = ({ gen, props, context }) => {
  const element = {
    canvas: [
      {
        type: 'line',
        x1: props.margin[3] || 0,
        y1: props.margin[0] || 0,
        x2: 500 - (props.margin[3] || 0),
        y2: props.margin[0] || 0,
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
