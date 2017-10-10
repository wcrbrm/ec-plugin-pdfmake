import React from 'react';
import { Logger, getValue } from 'ec-react15-lib';
import { renderPdfContainer } from './../../services/TplPdfLoader';

// const addPage = ({ gen, props }) => {
//   gen.addPage('A4');
//   gen.setMargins({
//     top: props.marginTop,
//     bottom: props.marginBottom,
//     left: props.marginLeft,
//     right: props.marginRight
//   });
// };

const PdfPage = ({ gen, props, context }) => {
  if (!gen) {
    Logger.of('pdfmake.PdfPage').warn('Missing gen object'); return false;
  }

  const elementData = getValue(props, 'elementData', context);
  const element = {
    pageBreak: 'after'
  };

  if (elementData && Object.keys(elementData).length) {
    if (props.container) {
      props.container.forEach((pageProps, index) => {
        const ctx = { ...context, row: { ...pageProps, index } };
        // if (props.container.length === (index - 1) && index > 0) ctx = { ...ctx, ...element };
        renderPdfContainer(gen, props.container, ctx);
      });
    }
  } else {
    renderPdfContainer(gen, props.container, context);
  }

  return false;
};

export default PdfPage;
