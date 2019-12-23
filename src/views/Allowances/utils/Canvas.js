class Canvas {
  constructor(elem) {
    this.$el = elem;
    this.$ctx = this.$el.getContext("2d");
    this.$width = this.$el.width;
    this.$height = this.$el.height;
    this.$help_canvas = document.createElement("canvas");
    this.$help_ctx = this.$help_canvas.getContext("2d");
    this.$data = {};
  }
  setSize({ width = "300", height = "150" }) {
    let computedWidth = width;
    let computedHeight = height;
    if (typeof computedWidth === "string") {
      computedWidth = parseFloat(computedWidth);
    }
    if (typeof computedHeight === "string") {
      computedHeight = parseFloat(computedHeight);
    }
    this.$el.setAttribute("width", computedWidth + "px");
    this.$el.setAttribute("height", computedHeight + "px");
    this.$width = this.$help_canvas.width = computedWidth;
    this.$height = this.$help_canvas.height = computedHeight;
  }
  clear(help) {
    this.$ctx.clearRect(0, 0, this.$width, this.$height);
    if (help) {
      this.$help_ctx.clearRect(0, 0, this.$width, this.$height);
    }
  }
  // https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
  roundRect(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    this.$ctx.beginPath();
    this.$ctx.moveTo(x + radius.tl, y);
    this.$ctx.lineTo(x + width - radius.tr, y);
    this.$ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.$ctx.lineTo(x + width, y + height - radius.br);
    this.$ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    this.$ctx.lineTo(x + radius.bl, y + height);
    this.$ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.$ctx.lineTo(x, y + radius.tl);
    this.$ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    this.$ctx.closePath();
    if (fill) {
      this.$ctx.fill();
    }
    if (stroke) {
      this.$ctx.stroke();
    }
  }
  getRandomColor() {
    const num = 256;
    const red = Math.floor(Math.random() * num);
    const green = Math.floor(Math.random() * num);
    const blue = Math.floor(Math.random() * num);
    const key = `${red},${green},${blue}`;
    if (this.$data[key]) {
      this.getRandomColor();
      return;
    }
    return key;
  }
}

export default Canvas;
