import { matchConditions, getFromCondition, getValue } from 'ec-react15-lib';

const getValueHelper = (field, props, context) =>
  (getValue(props, field, context) || getFromCondition(field, props, context) || false);

export const getPageStyling = (props, context) => {
  const marginLeft = getValueHelper('marginLeft', props, context) || 0;
  const marginRight = getValueHelper('marginRight', props, context) || 0;
  const marginBottom = getValueHelper('marginBottom', props, context) || 0;
  const marginTop = getValueHelper('marginTop', props, context) || 0;
  const width = getValueHelper('width', props, context) || 0;
  const height = getValueHelper('height', props, context) || 0;

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
    if (!matchConditions(props, props.display.conditions, context)) return false;
  }
  const stylesOverride = {};
  const margin = [];
  const marginTop = getValueHelper('marginTop', props, context) || 0;
  const marginRight = getValueHelper('marginRight', props, context) || 0;
  const marginBottom = getValueHelper('marginBottom', props, context) || 0;
  const marginLeft = getValueHelper('marginLeft', props, context) || 0;
  margin.push(marginLeft, marginTop, marginRight, marginBottom);

  const fontStyle = getValueHelper('fontStyle', props, context);
  const width = getValueHelper('width', props, context) || 0;
  const height = getValueHelper('height', props, context) || 0;

  const stylesAllowed = {
    color: getValueHelper('color', props, context) || null,
    bold: (fontStyle && fontStyle === 'bold') ? true : null,
    italics: (fontStyle && fontStyle === 'italic') ? true : null,
    fontSize: getValueHelper('fontSize', props, context) || null,
    font: getValueHelper('fontFamily', props, context) || null,
    lineHeight: getValueHelper('lineHeight', props, context) || null,
    alignment: getValueHelper('textAlign', props, context) || null,
    margin: (marginLeft || marginTop || marginRight || marginBottom) ? margin : null,
    pageSize: (width && height) ? { width, height } : null,
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
