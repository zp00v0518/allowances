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
import baseFunc from './baseFunc';

export default {
  name: 'Header',
  mixins: [baseFunc],
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 }
  },
  methods: {
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
    }
  },
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
