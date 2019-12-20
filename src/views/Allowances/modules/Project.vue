<template>
  <!-- <div class="project"> -->
  <canvas ref="canvas"></canvas>
  <!-- </div> -->
</template>

<script>
import { Canvas, config, time, h } from "../utils";
import baseFunc from "./baseFunc";
let count = 0;
let bigCount = 2000;

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
      const { startIndex, endIndex } = this;
      for (let i = startIndex; i < endIndex; i++) {
        const item = this.drawArr[i];
        this.drawLineProject(item);
      }
    },
    drawLineProject(item) {
      const { canvas, moskData, itemIndex, id } = this;
      const key = time.setMidnight(new Date(item.date)).getTime();
      const data = moskData[itemIndex].data[key];
      if (!data) return;
      const project = data.projects[id];
      if (!project) return;
      const ctx = canvas.$ctx;
      const position = item.position;
      const height = 20;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(position.startX, height);
      ctx.lineTo(position.endX, height);
      ctx.stroke();
      ctx.closePath();
      ctx.lineWidth = 1;
    }
  }
};
</script>
<style lang="scss">
.project {
  width: 100%;
  height: 50px;
}
</style>