class Canvas {
  constructor(elem) {
    this.$el = elem;
    this.$ctx = this.$el.getContext("2d");
    this.$width = this.$el.width;
    this.$height = this.$el.height;
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
    this.$width = computedWidth;
    this.$height = computedHeight;
  }
  clear() {
    this.$ctx.clearRect(0, 0, this.$width, this.$height);
  }
}

export default Canvas;
