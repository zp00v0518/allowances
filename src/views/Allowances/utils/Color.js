class Color {
  constructor(ctx, fill = 'black', stroke = 'black') {
    this.ctx = ctx;
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = stroke;
  }
  setColor({fill, stroke}) {
    this.ctx.fillStyle = fill ? fill : this.ctx.fillStyle;
    this.ctx.strokeStyle = stroke ? stroke : this.ctx.strokeStyle;
  }
}

export default Color;
