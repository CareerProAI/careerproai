/** pdf.js evaluates `new DOMMatrix()` at import. @napi-rs/canvas polyfills it, but a
 * Windows native fails to load under WSL and the process dies before listen(). */
export function ensurePdfJsDomPolyfills() {
  if (typeof globalThis.DOMMatrix === 'undefined') {
    globalThis.DOMMatrix = class DOMMatrix {
      constructor() {}
    };
  }
  if (typeof globalThis.ImageData === 'undefined') {
    globalThis.ImageData = class ImageData {
      constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
        this.data = new Uint8ClampedArray(Math.max(0, width * height * 4));
      }
    };
  }
  if (typeof globalThis.Path2D === 'undefined') {
    globalThis.Path2D = class Path2D {};
  }
}
