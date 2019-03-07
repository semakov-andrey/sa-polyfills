class Closest {
  constructor() {
    if (!Element.prototype.closest) {
      Element.prototype.closest = function (selector) {
        return this
          ? (this.msMatchesSelector(selector)
            ? this
            : (this.parentElement ? this.parentElement.closest(selector) : null))
          : null;
      };
    }
    if (window.SVGElementInstance) {
      window.SVGElementInstance.prototype.closest = function (selector) {
        return this.correspondingUseElement ? this.correspondingUseElement.closest(selector) : null;
      };
    }
    const svgClosest = function (selector) {
      return this.parentNode ? this.parentNode.closest(selector) : null;
    };
    SVGUseElement.prototype.closest = svgClosest;
    SVGSVGElement.prototype.closest = svgClosest;
  }
}

export default new Closest();