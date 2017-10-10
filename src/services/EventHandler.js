import { getDocumentContext, Logger } from 'ec-react15-lib';
import { generatePdf } from './TplPdfLoader';

export const onDataReady = ({ route, tpl, store }) => {
  if (route.pdf === 'pdfmake' || tpl.pdf === 'pdfmake') {
    Logger.of('pdfmake.EventHandler.onDataReady').warn('store=', store, 'tpl=', tpl, 'route=', route);
    const { dispatch } = store;
    setTimeout(() => { // giving digest a try
      const pdfTarget = tpl.pdfTarget || false;
      const pdfStatus = tpl.pdfStatus || false;
      if (pdfStatus) { dispatch({ type: 'SET_DATA', payload: [pdfStatus, 'loading'] }); }
      generatePdf(tpl.pdfContents, getDocumentContext(store.getState(), dispatch), (gen, context) => {
        gen.finish(pdfTarget, getDocumentContext(store.getState(), dispatch));
        // saves to file or somewhere to variable
        // filename can be false and it will open it in a new window.
        if (pdfStatus) { dispatch({ type: 'SET_DATA', payload: [pdfStatus, 'ready'] }); }
      });
    }, 50);
  }
};

export default { onDataReady };
