<template>
  <div class="allowances__item">
    <div class="allowances__item__header">{{item.name}}</div>
    <div class="allowances__item__content">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Canvas, config, time, h } from "../utils";
import baseFunc from "./baseFunc";

export default {
  name: "Item",
  inheritAttrs: false,
  mixins: [baseFunc],
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 },
    sizeCanvas: { type: Object, default: () => ({ width: 0, height: 0 }) },
    item: { type: Object, default: () => ({}) }
  },
  methods: {
    drawOneDay({ ctx, startX, startY, width, day }) {
      ctx.fillStyle = "transparent";
      const cellHeight = ctx.canvas.height;
      const date = new Date(day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.fillStyle = "#f0f0f2";
      }
      ctx.fillRect(startX, 0, width, cellHeight);
      const optionsForBorder = {
        strokeStyle: "#f0f0f2"
      };
      this.drawBorder({
        ctx,
        startX,
        startY: 0,
        width,
        height: cellHeight,
        options: optionsForBorder,
        side: "lr"
      });
      ctx.fillStyle = "black";
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
    box-sizing: border-box;
  }
  &__content {
    flex: 3;
    // width: 100%;
  }
}
</style>
