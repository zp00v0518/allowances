<template>
  <div class="allowances__header">
    <div class="allowances__header__search">
      <input type="search" />
    </div>
    <div class="allowances__header__canvas-container">
      <canvas ref="canvas" class="allowances__header__canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Canvas, config } from '../utils';

export default {
  name: 'Header',
  data() {
    return {
      canvas: null,
      isDraw: false,
      date: new Date().getTime(),
    };
  },
  methods: {
    init() {
      this.canvas = new Canvas(this.$refs.canvas);
      this.canvas.setSize(this.getSizeContainer());
      this.draw();
    },
    getSizeContainer() {
      const parent = this.$refs.canvas.parentElement;
      const styles = window.getComputedStyle(parent);
      const { width, height } = styles;
      return { width, height };
    },
    draw() {
      if (this.isDraw) return;
      this.isDraw = true;
      this.canvas.clear();
      this.drawAllDays({ ctx: this.canvas.$ctx, startDate: this.date});
      this.isDraw = false;
    },
    drawAllDays({ ctx, startDate }) {
      const { canvas } = this;
      const { day, zoom } = config;
      const cellWidth = day.width * zoom;
      const cellHeight = day.height * zoom;
      let x = 0;
      let y = 0;
      let curDate = startDate;
      let oneDay = 1000 * 60 * 60 * 24;

      for (let i = 0; i < canvas.$width; i += cellWidth) {
        this.drawOneDay({
          ctx,
          startX: i,
          startY: y,
          width: cellWidth,
          height: cellHeight,
          day: curDate,
        });
        curDate += oneDay;
      }
    },
    drawOneDay({ ctx, startX, startY, width, height, day }) {
      ctx.fillStyle = 'red';
      ctx.fillRect(startX, startY, width, height);
      this.drawBorder({ ctx, startX, startY, width, height });
    },
    drawBorder({ ctx, startX, startY, width, height }) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + width, startY);
      ctx.lineTo(startX + width, startY + height);
      ctx.lineTo(startX, startY + height);
      ctx.lineTo(startX, startY);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
    },
    drawTxt({ctx,}){},
    zoomingCanvas(event) {
      const { wheelDelta } = event;
      const zoomStep = 0.2;
      if (wheelDelta < 0) {
        config.zoom += zoomStep;
      } else {
        config.zoom -= zoomStep;
      }
      if (config.zoom < 1){
        config.zoom = 1;
      }
      this.draw();
    }
  },
  mounted() {
    this.init();
    this.$refs.canvas.addEventListener('wheel', this.zoomingCanvas);
  }
};
</script>

<style lang="scss">
.allowances__header {
  display: flex;
  height: 50px;
  &__search {
    border: 1px solid;
    box-sizing: border-box;
  }
  &__canvas-container {
    flex: 3;
    width: 100%;
  }
}
</style>
