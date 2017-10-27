import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Logger, getValue, setValue } from 'ec-react15-lib';
import * as commonPdfIndex from './../editable/pdf';
import PdfMake from './PdfMake';

const toDataURL = url => fetch(url) // eslint-disable-line
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader();  // eslint-disable-line
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

export const collectPdfImages = (tpl, context, callback) => {
  const imagesArray = tpl[0].container.filter(element => element.type === 'PdfImage');
  const requests = imagesArray.map((element) => {
    return new Promise((resolve, reject) => {
      const src = getValue(element, 'src', context);
      const variable = element.src || element['@src'];
      if (src && src.indexOf('http') !== -1) {
        toDataURL(src)
          .then((dataUrl) => {
            setValue(variable, dataUrl, context);
            resolve();
          })
          .catch((error) => {
            Logger.of('TplPdfLoader.toDataURL').warn('Error load=', error, 'src=', src);
            reject();
          });
      } else if (src && src.indexOf('data:image/') !== -1) {
        resolve();
      } else {
        reject();
      }
    });
  });
  Promise.all(requests)
    .then(() => {
      if (typeof callback === 'function') callback();
    })
    .catch(() => {
      Logger.of('TplPdfLoader.toDataURL')
        .warn('Images should contain dataURL entries (or local file paths in node.js)');
      if (typeof callback === 'function') callback();
    });
};

export const getPdfElementsList = (context) => {
  const { ecOptions } = context.globals;
  const elementsList = { ...commonPdfIndex.default };
  const plugin = ecOptions.plugins.find(p => (p.pluginName === 'pdfmake'));
  // Logger.of('TplPdfLoader.getPdfElementsList')
  //   .warn('plugin=', plugin, 'elementsList=', elementsList, 'commonPdfIndex=', commonPdfIndex);
  if (plugin) {
    const pdf = plugin.pdfmake;
    Object.keys(pdf).forEach((k) => { elementsList[k] = pdf[k]; });
  }
  return elementsList;
};

export const renderPdfContainer = (gen, container, context) => {
  const elementsList = getPdfElementsList(context);
  const { pageSize: { width = false }, pageMargins = [0, 0, 0, 0] } = gen.doc;
  const widthContainer = (width) ? width - pageMargins[0] - pageMargins[2] : false;
  container.forEach((props) => {
    // basically we are outlining container - where the component will be rendered
    const ctx = widthContainer ? { ...context, width: widthContainer } : { ...context };
    if (typeof elementsList[props.type] === 'function') {
      //Logger.of('TplPdfLoader.renderPdfContainer').warn('props=', props, 'ctx=', ctx, 'gen=', gen);
      // there is no merged context, as chilren typically are PdfPage's

      ReactDOMServer.renderToString(React.createElement(elementsList[props.type], { gen, props, context: ctx }));
    } else {
      Logger.of('TplPdfLoader.renderPdfContainer').error('Cannot render PDF element of type', props.type);
    }
  });
};

export const generatePdf = (tpl, context, callback) => {
  // lets imagine all images are already loaded
  const gen = new PdfMake();
  Logger.of('TplPdfLoader.generatePdf').info('started', 'gen=', gen);
  collectPdfImages(tpl, context, () => {
    renderPdfContainer(gen, tpl, context);
    if (typeof callback === 'function') callback(gen, context);
  });
};

export default {
  generatePdf
};
