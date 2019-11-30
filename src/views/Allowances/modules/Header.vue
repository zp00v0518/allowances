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
import { Canvas, config, time, h } from '../utils';

export default {
  name: 'Header',
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 }
  },
  methods: {
    init() {
      this.canvas = new Canvas(this.$refs.canvas);
      const size = h.getSizeContainer(this.$refs.canvas.parentElement);
      this.canvas.setSize(size);
    },
    draw(timestamp) {
      const now = new Date().getTime();
      if (!this.timer) {
        this.timer = now;
      }
      const progress = now - this.timer;
      if (progress > 50) {
        this.canvas.clear();
        const startDate = this.drawArr[this.startIndex].date;
        // const startDate = this.arrData[this.drawIndex.first].date;
        this.drawAllDays({ ctx: this.canvas.$ctx, startDate });
        this.timer = now;
      }
      this.requestId = requestAnimationFrame(this.draw);
    },
    drawAllDays({ ctx, startDate }) {
      const { canvas, startIndex, endIndex, swipe } = this;
      // const { canvas, drawIndex, swipe } = this;
      const { cell, zoom } = config;
      const cellWidth = cell.width * zoom;
      const cellHeight = (canvas.$height / 2) * zoom;
      let count = 0;
      for (let i = startIndex; i < endIndex; i++) {
        const item = this.drawArr[i];
        // const item = this.arrData[i];
        this.drawOneDay({
          ctx,
          startX: count * cellWidth,
          startY: canvas.$height / 2,
          width: cellWidth,
          height: cellHeight,
          day: item.date
        });
        count++;
      }
    },
    drawOneDay({ ctx, startX, startY, width, height, day }) {
      ctx.fillStyle = 'transparent';
      const date = new Date(day);
      const month = date.getMonth();
      const middleDay = Math.floor(time.dayInMonth[month] / 2);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.fillStyle = 'grey';
      }
      ctx.fillRect(startX, startY, width, height);
      this.drawBorder({ ctx, startX, startY, width, height, day });
      ctx.fillStyle = 'black';
      const num = date.getDate();
      this.drawTxt({
        ctx,
        startX,
        startY,
        width,
        height: ctx.canvas.height / 2,
        txt: num
      });
      if (num === middleDay) {
        const monthName = time.fullMonths[month];
        this.drawTxt({
          ctx,
          startX,
          startY: 0,
          width,
          height: ctx.canvas.height / 2,
          txt: monthName
        });
      }
    },
    drawBorder({ ctx, startX, startY, width, height, day }) {
      const date = new Date(day).getDate();
      ctx.beginPath();
      if (date !== 1) {
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX + width, startY + height);
        ctx.lineTo(startX, startY + height);
      } else {
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, ctx.canvas.height);
        ctx.lineTo(startX + width, ctx.canvas.height);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX, startY);
      }
      // ctx.lineTo(startX, startY);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
    },
    drawTxt({
      ctx,
      startX,
      startY,
      width,
      height,
      txt = '',
      align = 'center',
      size = 10
    }) {
      let x = startX;
      let y = startY;
      ctx.textAlign = align;
      if (align === 'center') {
        x += width / 2;
        y += height / 2;
        ctx.textBaseline = 'middle';
      }
      if (size) {
        const font = Math.round(size + config.zoom);
        ctx.font = font + 'px Nunito';
      }
      ctx.fillText(txt, x, y);
    },
  },
  mounted() {
    this.init();
    requestAnimationFrame(this.draw);
  },
  beforeMount() {
    cancelAnimationFrame(this.requestID);
  }
};
</script>

<style lang="scss">
.allowances__header {
  display: flex;
  height: 50px;
  &__search {
    min-width: 200px;
    border: 1px solid;
    border-left: none;
    border-top: none;
    box-sizing: border-box;
  }
  &__canvas-container {
    flex: 2;
    // width: 100%;
    // overflow: hidden;
    // overflow-x: scroll;
  }
}
</style>
