export default {
  isIE10() {
    return /MSIE 10/i.test(navigator.userAgent);
  },
  isIE11() {
    return /rv:11.0/i.test(navigator.userAgent);
  },
  isEdge() {
    return /Edge\/\d./i.test(navigator.userAgent);
  },
  isIE10Plus() {
    return this.isIE10() || this.isIE11();
  },
  isIEOrEdge() {
    return this.isIE10() || this.isIE11() || this.isEdge();
  },
  isSafari() {
    return navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
  }
};