const { userAgent, platform, vendor } = navigator;

export default {
  isIE10() {
    return /MSIE 10/i.test(userAgent);
  },
  isIE11() {
    return /rv:11.0/i.test(userAgent);
  },
  isEdge() {
    return /Edge\/\d./i.test(userAgent);
  },
  isEdgeChromium() {
    return /Edg\//.test(userAgent);
  },
  isIE10Plus() {
    return this.isIE10() || this.isIE11();
  },
  isIEOrEdge() {
    return this.isIE10() || this.isIE11() || this.isEdge();
  },
  isSafari() {
    return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  },
  isAppleDevice() {
    return platform.match(/(Mac|iPhone|iPod|iPad)/i);
  },
  isFirefox() {
    return /Firefox/.test(userAgent);
  },
  isChrome() {
    return /Chrome/.test(userAgent) && /Google Inc/.test(vendor);
  },
  isOpera() {
    return /OPR\//.test(userAgent);
  }
};