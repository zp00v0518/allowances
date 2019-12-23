<template>
  <div class="allowances">
    <Header
      v-if="isPrepered"
      :drawArr="arrData"
      :startIndex="drawIndex.first"
      :endIndex="drawIndex.last"
      :sizeCanvas="sizeCanvas"
      :swipe="swipe.prevPosition.distance"
    />
    <div ref="content" class="allowances__content">
      <template v-if="isPrepered">
        <Item
          v-for="(item, index) in moskData"
          :drawArr="arrData"
          :startIndex="drawIndex.first"
          :endIndex="drawIndex.last"
          :sizeCanvas="sizeCanvas"
          :key="index"
          :item="item"
          :swipe="swipe"
          :moskData="moskData"
          :itemIndex="index"
        />
      </template>
    </div>
  </div>
</template>

<script>
import modules from "./modules";
import { config, time, h } from "./utils";
import moskData from "./moskData";
window.moskData = moskData;
window.time = time;

export default {
  name: "Allowances",
  components: {
    ...modules
  },
  data() {
    return {
      moskData,
      isPrepered: false,
      date: new Date(),
      arrData: [],
      drawIndex: {
        first: 0,
        last: 0
      },
      sizeCanvas: {
        width: 0,
        height: 0
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
      const el = this.$refs.content;
      const width = el.getBoundingClientRect().width;
      const { cell, zoom } = config;
      const num = Math.ceil(parseFloat(width) / (cell.width * zoom));
      return num + 1;
    },
    createArrData(num = this.getNumCell()) {
      const { date, arrData } = this;
      // time.setMidnight(date);
      let curDate = time.setMidnight(date).getTime();
      for (let i = 0; i < num; i++) {
        const d = {
          date: curDate,
          code: time.getDateString(new Date(curDate))
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
      let num_add_cell = Math.ceil(Math.abs(distance) / (cell.width * zoom));
      if (way === config.way.left) {
        drawIndex.first += num_add_cell;
        drawIndex.last = drawIndex.first + num;
        if (drawIndex.last > this.arrData.length) {
          this.addDataToArr(way, drawIndex.last - this.arrData.length);
        }
      } else if (way === config.way.right) {
        const curIndex = drawIndex.first;
        drawIndex.first = curIndex - num_add_cell;
        drawIndex.last = drawIndex.first + num;
        if (drawIndex.first < 0) {
          this.addDataToArr(way, Math.abs(drawIndex.first));
          drawIndex.first = 0;
          drawIndex.last = num;
        }
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
          d.date = time
            .setMidnight(new Date(lastDate + time.day * (i + 1)))
            .getTime();
          // d.date = lastDate + time.day * (i + 1);
          (d.code = time.getDateString(new Date(d.date))), arrData.push(d);
        }
        if (way === config.way.right) {
          d.date = time
            .setMidnight(new Date(lastDate - time.day * (i + 1)))
            .getTime();
          // d.date = lastDate - time.day * (i + 1);
          (d.code = time.getDateString(new Date(d.date))), arrData.unshift(d);
        }
      }
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
    },
    setMouseDown(e) {
      const { swipe } = this;
      if (e.type === "mousedown" || e.type === "touchstart") {
        this.$refs.content.style.cursor = "grab";
        swipe.isMouseDown = true;
        swipe.prevPosition.x = e.pageX || e.changedTouches[0].screenX;
        swipe.time = new Date().getTime();
      }
      if (
        e.type === "mouseup" ||
        e.type === "mouseleave" ||
        e.type === "touchend" ||
        e.type === "touchcancel"
      ) {
        this.$refs.content.style.cursor = "default";
        swipe.isMouseDown = false;
        swipe.time = null;
      }
    },
    handlerMouseMove(event) {
      const { swipe } = this;
      if (!swipe.isMouseDown) return;
      const curTime = new Date().getTime();
      if (curTime - swipe.time < 100) return;
      swipe.time = curTime;
      swipe.way = this.checkWay(event, swipe.prevPosition) || swipe.way;
      this.setIndexForDraw(swipe.way, swipe.prevPosition.distance);
    },
    checkWay(e, prevPosition = this.swipe.prevPosition) {
      const curX = e.pageX || e.changedTouches[0].screenX;
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
    this.createArrData();
    this.setIndexForDraw();
    this.$refs.content.addEventListener("wheel", this.zoomingCanvas);
    this.$refs.content.addEventListener("mousedown", this.setMouseDown);
    this.$refs.content.addEventListener("touchstart", this.setMouseDown);
    this.$refs.content.addEventListener("mouseup", this.setMouseDown);
    this.$refs.content.addEventListener("touchend", this.setMouseDown);
    this.$refs.content.addEventListener("touchcancel", this.setMouseDown);
    this.$refs.content.addEventListener("mouseleave", this.setMouseDown);
    this.$refs.content.addEventListener("mousemove", this.handlerMouseMove);
    this.$refs.content.addEventListener("touchmove", this.handlerMouseMove);
    const size = h.getSizeContainer(this.$el);
    this.sizeCanvas.width = size.width - 200;
    this.$nextTick(() => {
      this.isPrepered = true;
    });
  }
};
</script>

<style lang="scss">
.allowances {
  border: 1px solid;
  box-sizing: border-box;
  overflow: hidden;
  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
