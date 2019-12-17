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
import { Canvas, config, time, h } from "../utils";
import baseFunc from "./baseFunc";

export default {
  name: "Header",
  mixins: [baseFunc],
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 },
    sizeCanvas: { type: Object, default: () => ({ width: 0, height: 0 }) },
    swipe: { type: Number, default: 0 }
  },
  methods: {
    drawOneDay({ ctx, startX, startY, width, height, item, options = {} }) {
      const day = item.date;
      Object.assign(ctx, options);
      ctx.fillStyle = "transparent";
      const date = new Date(day);
      const month = date.getMonth();
      const middleDay = Math.floor(time.dayInMonth[month] / 2);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.fillStyle = "#f0f0f2";
      }
      const computedX = startX;
      const computedY = startY;
      ctx.fillRect(computedX, computedY, width, height);

      const num = date.getDate();
      const optionsForBorder = {
        strokeStyle: "#f0f0f2"
      };
      if (num !== 1) {
        this.drawBorder({
          ctx,
          startX: computedX,
          startY: computedY,
          width,
          height,
          side: "trb",
          options: optionsForBorder
        });
      } else {
        this.drawBorder({
          ctx,
          startX: computedX,
          startY: 0,
          width,
          height: this.canvas.$height,
          side: "l",
          options: optionsForBorder
        });
        this.drawBorder({
          ctx,
          startX: computedX,
          startY: computedY,
          width,
          height,
          side: "trb",
          options: optionsForBorder
        });
      }
      const font = Math.round(14 + config.zoom);
      const optionsForTxt = {
        fillStyle: "black",
        font: `bold ${font}px Avenir Helvetica`,
      };
      this.drawTxt({
        ctx,
        startX: computedX,
        startY: computedY,
        width,
        height: ctx.canvas.height / 2,
        txt: num,
        options: optionsForTxt
      });
      if (num === middleDay) {
        const monthName = time.fullMonths[month];
        this.drawTxt({
          ctx,
          startX: computedX,
          startY: 0,
          width,
          height: ctx.canvas.height / 2,
          txt: monthName,
          options: optionsForTxt
        });
      }
    }
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
