import editablePdfMake from './editable/pdf';
import { onDataReady } from './services/EventHandler';

export default {
  pluginName: 'pdfmake',
  // callback is called when we've loaded all the data for the route
  onDataReady,
  // list of components, exporting as there might be some dependencies
  editablePdfMake
};
