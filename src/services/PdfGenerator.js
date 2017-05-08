import { setValue } from 'ec-react15-lib';
import { colorToArray } from './PdfColors';

const isModernBrowser = () => {
  if (!window) return false;
  const ua = window.navigator.userAgent;
  const old = (ua.indexOf('MSIE') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0);
  return !old;
};

class PdfGenerator {
  page = 0;
  dimensions = { width: 0, height: 0 };
  doc = null;
  margin = { left: 5, top: 5, right: 5, bottom: 5 };
  pageX = 0;
  pageY = 0;

  setDimensions = (dim) => {
    this.dimensions = dim;
    this.width = dim.width;
    this.height = dim.height;
  }
  setMargins = (margin) => {
    this.margin = margin;
    this.pageY = this.margin.top;
    this.pageX = this.margin.left;
  }
  addPage = (format) => {
    if (this.page === 0) {
      this.doc = new jsPDF('p', 'mm', format); // eslint-disable-line
    } else {
      // [width, height]
      this.doc.addPage('p', 'mm', format);
    }
    this.setDimensions({
      width: this.doc.internal.pageSize.width,
      height: this.doc.internal.pageSize.height
    });
    this.page += 1;
    this.pageY = 0;
  }
  getDocWidth = () => {
    return this.dimensions.width;
  };
  getDocHeight = () => {
    return this.dimensions.height;
  };
  getDoc = () => {
    return this.doc;
  };
  getX = () => {
    return this.pageX;
  };
  getY = () => {
    return this.pageY;
  };
  setY = (y) => {
    this.pageY = y;
  };
  addX = (x) => {
    this.pageX += x;
  };
  addY = (y) => {
    const height = this.doc.internal.pageSize.height - this.margin.bottom;
    if (typeof y !== 'undefined') { this.pageY += y; }
    if (this.format && height < this.pageY) {
      this.doc.addPage('p', 'mm', this.format);
      this.pageY = this.margin.top;
    }
  };
  addHandler = (event, callback) => {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(callback);
  };
  finish = (pdfTarget, context) => {
    //this.endPage(true);
    if (pdfTarget) {
      if (pdfTarget === '_blank') {
        return this.doc.output('dataurlnewwindow');
      }
      const file = pdfTarget || 'print-version';
      if (file.indexOf('.pdf') === -1) {
        setValue(`g:${pdfTarget}`, this.doc.output('datauristring'), context);
      } else {
        this.doc.save(pdfTarget);
      }
    } else if (isModernBrowser()) {
      // opening PDF in the same window. this might be not supported bu old browsers
      this.doc.output('dataurl');
    } else {
      this.doc.save('output.pdf'); // fallback...
    }
    // later: review case for server side
    return true;
  };

  df = () => {
    return this.doc.internal.getFontSize() / this.doc.internal.scaleFactor;
  };

  drawText = (x, y, value) => {
    if (typeof value === 'undefined') return;
    this.doc.text(x, y, value);
  };

  drawAlignedText = (x, y, width, align, value, lineHeight) => {
    if (typeof value === 'undefined') return;
    if (Object.prototype.toString.call(value) === '[object Array]') {
      let yy = y;
      for (let i = 0; i < value.length; i += 1) {
        this.drawAlignedText(x, yy, width, align, value[i]);
        if (lineHeight) yy += lineHeight;
      }
      return;
    }
    if (align === 'R') {
      this.drawText((x + width) - (this.df() * this.doc.getStringUnitWidth(value)), y, value);
    } else if (align === 'C') {
      this.drawText((x + (width / 2)) - ((this.df() * this.doc.getStringUnitWidth(value)) / 2), y, value);
    } else {
      this.drawText(x, y, value);
    }
  };

  setFont = (fontSize, fontWeight) => {
    if (typeof fontSize !== 'undefined') this.doc.setFontSize(fontSize);
    if (typeof fontWeight !== 'undefined') this.doc.setFontType(fontWeight);
  };

  setTextColor = (color) => {
    if (!color) return;
    const clrArray = colorToArray(color);
    if (clrArray) this.doc.setTextColor(clrArray[0], clrArray[1], clrArray[2]);
  };
  setFillColor = (color) => {
    if (!color) return;
    const clrArray = colorToArray(color);
    if (clrArray) this.doc.setFillColor(clrArray[0], clrArray[1], clrArray[2]);
  };
  setDrawColor = (color) => {
    if (!color) return;
    const clrArray = colorToArray(color);
    if (clrArray) this.doc.setDrawColor(clrArray[0], clrArray[1], clrArray[2]);
  };

}

export default PdfGenerator;
