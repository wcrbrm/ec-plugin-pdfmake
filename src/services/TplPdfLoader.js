import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Logger, getValue, setValue } from 'ec-react15-lib';
import * as commonPdfIndex from './../editable/pdf';
import PdfMake from './PdfMake';

const toDataURL = (src, callback, outputFormat) => {
  const img = new Image();  // eslint-disable-line
  img.crossOrigin = 'Anonymous';
  img.onerror = () => Logger.of('TplPdfLoader.toDataURL').info('Image not loaded src=', src);
  img.onload = function () {
    Logger.of('TplPdfLoader.toDataURL').info('Image loaded src=', src);
    const canvas = document.createElement('CANVAS');  // eslint-disable-line
    const ctx = canvas.getContext('2d');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    const dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = src;
  }
};

export const collectPdfImages = (tpl, context, callback) => {
  const imagesArray = tpl[0].container.filter(element => element.type === 'PdfImage');
  const requests = imagesArray.map((element) => {
    return new Promise((resolve) => {
      const src = getValue(element, 'src', context);
      const variable = element.src || element['@src'];
      if (src && src.indexOf('http') !== -1) {
        toDataURL(
          src,
          (dataUrl = '') => {
            Logger.of('TplPdfLoader.toDataURL').info('Image dataUrl=', dataUrl);
            setValue(variable, dataUrl, context);
            resolve();
          }
        );
      } else if (src && src.indexOf('data:image/') !== -1) {
        Logger.of('TplPdfLoader.toDataURL').info('Image dataUrl=', src);
        resolve();
      } else {
        Logger.of('TplPdfLoader.toDataURL').info('Image src=', src);
        resolve();
      }
    });
  });
  Promise.all(requests).then(() => {
    if (typeof callback === 'function') callback();
  });
};

export const getPdfElementsList = (context) => {
  const { ecOptions } = context.globals;
  const elementsList = { ...commonPdfIndex.default };
  const plugin = ecOptions.plugins.find(p => (p.pluginName === 'pdfmake'));
  Logger.of('TplPdfLoader.getPdfElementsList')
    .warn('plugin=', plugin, 'elementsList=', elementsList, 'commonPdfIndex=', commonPdfIndex);
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
      Logger.of('TplPdfLoader.renderPdfContainer').warn('props=', props, 'ctx=', ctx, 'gen=', gen);
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
  Logger.of('TplPdfLoader.generatePdf').warn('started', 'gen=', gen);
  collectPdfImages(tpl, context, () => {
    renderPdfContainer(gen, tpl, context);
    if (typeof callback === 'function') callback(gen, context);
  });
};

export default {
  generatePdf
};
