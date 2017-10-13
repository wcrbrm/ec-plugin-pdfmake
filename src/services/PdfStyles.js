import { matchConditions, getValue } from 'ec-react15-lib';

export const getPageStyling = (props, context) => {
  const marginLeft = getValue(props, 'marginLeft', context) || 0;
  const marginRight = getValue(props, 'marginRight', context) || 0;
  const marginBottom = getValue(props, 'marginBottom', context) || 0;
  const marginTop = getValue(props, 'marginTop', context) || 0;
  const width = getValue(props, 'width', context) || 0;
  const height = getValue(props, 'height', context) || 0;

  if (props.display && props.display.conditions) {
    if (!matchConditions(props, props.display.conditions, context)) return false;
  }
  const stylesOverride = {};
  const margin = [];
  margin.push(marginLeft, marginTop, marginRight, marginBottom);

  const stylesAllowed = {
    pageMargins: (marginLeft || marginTop || marginRight || marginBottom) ? margin : null,
    pageSize: (width && height) ? { width, height } : null
  };
  Object.keys(stylesAllowed).forEach((key) => {
    if (stylesAllowed[key] !== undefined && stylesAllowed[key] !== null) {
      stylesOverride[key] = stylesAllowed[key];
    }
  });

  return stylesOverride;
};

export const getElementStyling = (props, context) => {
  if (props.display && props.display.conditions) {
    if (!matchConditions(props, props.display.conditions, context)) {
      return false;
    }
  }
  const stylesOverride = {};
  const margin = [];
  const {
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0
  } = props;
  margin.push(marginLeft, marginTop, marginRight, marginBottom);

  const stylesAllowed = {
    color: props.color || null,
    bold: (props.fontStyle && props.fontStyle === 'bold') ? true : null,
    italics: (props.fontStyle && props.fontStyle === 'italic') ? true : null,
    fontSize: props.fontSize || null,
    font: props.fontFamily || null,
    lineHeight: props.lineHeight || null,
    alignment: props.textAlign || null,
    margin: (marginLeft || marginTop || marginRight || marginBottom) ? margin : null,
    pageSize: (props.width && props.height) ? { width: props.width, height: props.height } : null,
    layout: props.layout || null,
    table: (props.headerRows || props.widths)
      ? { headerRows: props.headerRows || 1, widths: props.widths || null } : null
  };

  Object.keys(stylesAllowed).forEach((key) => {
    if (stylesAllowed[key] !== undefined && stylesAllowed[key] !== null) {
      stylesOverride[key] = stylesAllowed[key];
    }
  });

  return stylesOverride;
};

export default {
  getElementStyling,
  getPageStyling
};
