export const colorToArray = (c) => {
  if (c && c.length === 3) {
    const colorR = c.length > 0 ? c[0] : undefined;
    const colorG = c.length > 1 ? c[1] : undefined;
    const colorB = c.length > 2 ? c[2] : undefined;
    return [colorR, colorG, colorB];
  }
  if (typeof c === 'string') {
    const cHex = c.replace('#', '');
    const colorR = parseInt(cHex.substring(0, 2), 16);
    const colorG = parseInt(cHex.substring(2, 4), 16);
    const colorB = parseInt(cHex.substring(4, 6), 16);
    return [colorR, colorG, colorB];
  }
  return undefined;
};

export default {
  colorToArray
};
