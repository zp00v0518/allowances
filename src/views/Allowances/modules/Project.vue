<template>
  <canvas ref="canvas" @click="handlerMouseMove"></canvas>
</template>

<script>
import { Canvas, config, time, h } from "../utils";
import baseFunc from "./baseFunc";
let count = 0;
let bigCount = 1000;

export default {
  name: "Project",
  inheritAttrs: false,
  mixins: [baseFunc],
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 },
    sizeCanvas: { type: Object, default: () => ({ width: 0, height: 0 }) },
    moskData: { type: Array },
    project: { type: Object, required: true }
  },
  data() {
    return {
      id: this.project.id,
      isProject: true
    };
  },
  methods: {
    drawOneDay({ ctx, startX, startY, width, item }) {
      const day = item.date;
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
      count++;
      if (count === bigCount) {
        count = 0;
      }
    },
    darwAllLineProject() {
      const { startIndex, endIndex, canvas } = this;
      for (let i = startIndex; i < endIndex; i++) {
        const item = this.drawArr[i];
        const color = item.pickColor || canvas.getRandomColor();
        item.pickColor = color;
        this.drawLineProject({ ctx: canvas.$ctx, item });
        canvas.$data[color] = item;
        this.drawLineProject({
          ctx: canvas.$help_ctx,
          item,
          color: `rgb(${color})`
        });
      }
    },
    drawLineProject({ ctx, item, color = "red" }) {
      const { moskData, itemIndex, id } = this;
      const key = time.setMidnight(new Date(item.date)).getTime();
      const data = moskData[itemIndex].data[key];
      if (!data) return;
      const project = data.projects[id];
      if (!project) return;
      const position = item.position;
      const height = 20;
      ctx.lineWidth = 6;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(position.startX, height);
      ctx.lineTo(position.endX, height);
      ctx.stroke();
      ctx.closePath();
      ctx.lineWidth = 1;
    },
    handlerMouseMove(event) {
      const { offsetX, offsetY } = event;
      const { canvas } = this;
      const pixel = canvas.$help_ctx.getImageData(offsetX, offsetY, 1, 1).data;
      const key = `${pixel[0]},${pixel[1]},${pixel[2]}`;
      const data = canvas.$data[key];
      const date = data ? data.code : "клик мимо линии проекта";
      console.log(date);
    }
  },
  beforeDestroy() {
    // document.body.removeChild(this.canvas.$help_canvas);
  }
};
</script>
<style lang="scss">
.project {
  width: 100%;
  height: 50px;
}
</style>