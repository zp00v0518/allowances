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
      drawIndex: {
        first: 0,
        last: 0
      },
      swipe: {
        isMouseDown: false,
        time: null,
        prevPosition: {
          x: null,
          y: null,
          distance: 0
        },
        way: null
      }
    };
  },

  methods: {
    getNumCell() {
      const width = this.canvas.$width;
      const { cell, zoom } = config;
      const num = Math.ceil(parseFloat(width) / (cell.width * zoom));
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
    setIndexForDraw(way, distance) {
      const { drawIndex } = this;
      const num = this.getNumCell();
      if (way === undefined) {
        drawIndex.first = 0;
        drawIndex.last = num;
        return;
      }
      const { cell, zoom } = config;
      const num_add_cell = Math.ceil(Math.abs(distance) / (cell.width * zoom));
      if (way === config.way.left) {
        drawIndex.first += num_add_cell;
        drawIndex.last = drawIndex.first + num;
        if (drawIndex.last > this.arrData.length) {
          this.addDataToArr(way, drawIndex.last - this.arrData.length);
        }
      } else if (way === config.way.right) {
        // const firstDraw = this.arrData[drawIndex.first].date;
        const curIndex = drawIndex.first;
        const dif = curIndex - num_add_cell;
        if (dif < 0) {
          this.addDataToArr(way, Math.abs(dif));
        }
        drawIndex.first = 0;
        drawIndex.last = num;
      }
    },
    addDataToArr(way, num) {
      const { arrData, drawIndex } = this;
      let lastDate;
      if (way === config.way.left) {
        lastDate = arrData[arrData.length - 1].date;
      }
      if (way === config.way.right) {
        lastDate = arrData[0].date;
      }
      for (let i = 0; i < num; i++) {
        const d = {};
        if (way === config.way.left) {
          d.date = lastDate + time.day * (i + 1);
          arrData.push(d);
        }
        if (way === config.way.right) {
          d.date = lastDate - time.day * (i + 1);
          arrData.unshift(d);
        }
      }
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
      const startDate = this.arrData[this.drawIndex.first].date;
      this.drawAllDays({ ctx: this.canvas.$ctx, startDate });
      this.isDraw = false;
    },
    drawAllDays({ ctx, startDate }) {
      const { canvas, drawIndex, swipe } = this;
      const { cell, zoom } = config;
      const cellWidth = cell.width * zoom;
      const cellHeight = cell.height * zoom;
      let count = 0;
      for (let i = drawIndex.first; i < drawIndex.last; i++) {
        const item = this.arrData[i];
        this.drawOneDay({
          ctx,
          startX: count * cellWidth,
          startY: 0,
          width: cellWidth,
          height: cellHeight,
          day: item.date
        });
        count++;
      }
    },
    drawOneDay({ ctx, startX, startY, width, height, day }) {
      ctx.fillStyle = "transparent";
      const date = new Date(day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.fillStyle = "grey";
      }
      ctx.fillRect(startX, startY, width, height);
      this.drawBorder({ ctx, startX, startY, width, height });
      ctx.fillStyle = "black";
      const num = date.getDate();
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
        swipe.prevPosition.x = e.pageX;
        swipe.time = new Date().getTime();
        this.$refs.canvas.style.cursor = "grab";
      }
      if (e.type === "mouseup" || e.type === "mouseleave") {
        swipe.isMouseDown = false;
        swipe.time = null;
        this.$refs.canvas.style.cursor = "default";
      }
    },
    handlerMouseMove(event) {
      const { swipe } = this;
      if (!swipe.isMouseDown) return;
      const curTime = new Date().getTime();
      if (curTime - swipe.time < 50) return;
      swipe.time = curTime;
      swipe.way = this.checkWay(event, swipe.prevPosition) || swipe.way;
      this.setIndexForDraw(swipe.way, swipe.prevPosition.distance);
      this.draw();
    },
    checkWay(e, prevPosition = this.swipe.prevPosition) {
      const curX = e.pageX;
      const prevX = prevPosition.x;
      prevPosition.distance = curX - prevX;
      prevPosition.x = curX;
      if (prevX < curX) {
        return config.way.right;
      }
      if (prevX > curX) return config.way.left;
    }
  },
  mounted() {
    this.init();
    this.createArrData();
    this.setIndexForDraw();
    requestAnimationFrame(()=>{
      this.draw();
    })
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
