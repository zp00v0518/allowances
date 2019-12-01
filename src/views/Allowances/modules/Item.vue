<template>
  <div class="allowances__item">
    <div class="allowances__item__header"></div>
    <div class="allowances__item__content">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Canvas, config, time, h } from '../utils';
import baseFunc from './baseFunc';

export default {
  name: 'Item',
  mixins: [baseFunc],
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 },
    sizeCanvas: { type: Object, default: () => ({ width: 0, height: 0 }) }
  },
  methods: {
    drawOneDay({ ctx, startX, startY, width, height, day }) {
      ctx.fillStyle = 'transparent';
      const date = new Date(day);
      const month = date.getMonth();
      const middleDay = Math.floor(time.dayInMonth[month] / 2);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.fillStyle = '#f0f0f2';
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
    }
  }
};
</script>

<style lang="scss" scoped>
.allowances__item {
  display: flex;
  height: 50px;
  &__header {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    border: 1px solid;
    border-left: none;
    border-top: none;
  }
  &__content {
    flex: 3;
    // width: 100%;
  }
}
</style>
