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
import { Canvas, config, time } from "../utils";

export default {
  name: "Header",
  data() {
    return {
      canvas: null,
      isDraw: false,
      date: new Date(),
      arrData: [],
      drawArr: [],
      first_draw_index: 0,
      swipe: {
        isMouseDown: false,
        time: null,
        prevPosition: {
          x: null,
          y: null,
          distance: null
        },
        way: null
      }
    };
  },

  methods: {
    getNumCell() {
      const width = this.canvas.$width;
      const { day, zoom } = config;
      const num = Math.ceil(parseFloat(width) / (day.width * zoom));
      return num;
    },
    createArrData(num = this.getNumCell()) {
      const { date, arrData } = this;
      let curDate = this.date.getTime();
      for (let i = 0; i < num; i++) {
        const d = {
          date: curDate
        };
        arrData.push(d);
        curDate += time.day;
      }
    },
    getIndexForDraw() {
      const num = this.getNumCell();
      const template = {
        startIndex: this.first_draw_index,
        endIndex: num
      };
      return template;
    },
    init() {
      this.canvas = new Canvas(this.$refs.canvas);
      const size = this.getSizeContainer();
      this.canvas.setSize(size);
    },
    getSizeContainer() {
      const parent = this.$refs.canvas.parentElement;
      const styles = window.getComputedStyle(parent);
      const { width, height } = styles;
      return { width: parseFloat(width), height: parseFloat(height) };
    },
    draw() {
      if (this.isDraw) return;
      this.isDraw = true;
      this.canvas.clear();
      this.drawAllDays({ ctx: this.canvas.$ctx, startDate: this.date });
      this.isDraw = false;
    },
    drawAllDays({ ctx, startDate }) {
      const { canvas } = this;
      const { day, zoom } = config;
      const cellWidth = day.width * zoom;
      const cellHeight = day.height * zoom;
      const drawIndex = this.getIndexForDraw();

      for (let i = drawIndex.startIndex; i < drawIndex.endIndex; i++) {
        const item = this.arrData[i];
        this.drawOneDay({
          ctx,
          startX: i * cellWidth,
          startY: 0,
          width: cellWidth,
          height: cellHeight,
          day: item.date
        });
      }
    },
    drawOneDay({ ctx, startX, startY, width, height, day }) {
      ctx.fillStyle = "transparent";
      ctx.fillRect(startX, startY, width, height);
      this.drawBorder({ ctx, startX, startY, width, height });
      ctx.fillStyle = "black";
      const num = new Date(day).getDate();
      this.drawTxt({ ctx, startX, startY, width, height, txt: num });
    },
    drawBorder({ ctx, startX, startY, width, height }) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + width, startY);
      ctx.lineTo(startX + width, startY + height);
      ctx.lineTo(startX, startY + height);
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
      txt = "",
      align = "center",
      size = 10
    }) {
      let x = startX;
      let y = startY;
      ctx.textAlign = align;
      if (align === "center") {
        x += width / 2;
        y += height / 2;
        ctx.textBaseline = "middle";
      }
      if (size) {
        const font = Math.round(size + config.zoom);
        ctx.font = font + "px Nunito";
      }
      ctx.fillText(txt, x, y);
    },
    zoomingCanvas(event) {
      const { wheelDelta } = event;
      const zoomStep = 0.2;
      if (wheelDelta < 0) {
        config.zoom += zoomStep;
      } else {
        config.zoom -= zoomStep;
      }
      if (config.zoom < 1) {
        config.zoom = 1;
      }
      this.draw();
    },
    setMouseDown(e) {
      const { swipe } = this;
      if (e.type === "mousedown") {
        swipe.isMouseDown = true;
        swipe.time = new Date().getTime();
      }
      if (e.type === "mouseup" || e.type === "mouseleave") {
        swipe.isMouseDown = false;
        swipe.time = null;
      }
    },
    handlerMouseMove(event) {
      const { swipe } = this;
      if (!swipe.isMouseDown) return;
      const curTime = new Date().getTime();
      if (curTime - swipe.time < 200) return;
      swipe.time = curTime;
      swipe.way = this.checkWay(event, swipe.prevPosition) || swipe.way;
      swipe.prevPosition.distance = this.checkDistance(event, swipe.prevPosition);

    },
    checkWay(e, prevPosition = this.swipe.prevPosition) {
      const curX = e.pageX;
      const prevX = prevPosition.x;
      prevPosition.x = curX;
      if (prevX < curX) {
        return config.way.right;
      }
      if (prevX > curX) return config.way.left;
    },
    checkDistance(e, prevPosition = this.swipe.prevPosition) {
      const curX = e.pageX;
      if (prevPosition.distance === null){
        prevPosition.distance = curX;
      }
      return curX - prevPosition.distance;
    }
  },
  mounted() {
    this.init();
    this.createArrData();
    this.draw();
    this.$refs.canvas.addEventListener("wheel", this.zoomingCanvas);
    this.$refs.canvas.addEventListener("mousedown", this.setMouseDown);
    this.$refs.canvas.addEventListener("mouseup", this.setMouseDown);
    this.$refs.canvas.addEventListener("mouseleave", this.setMouseDown);
    this.$refs.canvas.addEventListener("mousemove", this.handlerMouseMove);
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
    // overflow: hidden;
    // overflow-x: scroll;
  }
}
</style>
