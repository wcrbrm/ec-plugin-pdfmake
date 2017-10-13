import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Logger } from 'ec-react15-lib';
import * as commonPdfIndex from './../editable/pdf';
import PdfMake from './PdfMake';

export const collectPdfImages = (tpl, context, callback) => {
  // TODO: go through the tree of image
  if (typeof callback === 'function') callback();
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
