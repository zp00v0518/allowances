<template>
  <div class="allowances">
    <Header
      :drawArr="arrData"
      :startIndex="drawIndex.first"
      :endIndex="drawIndex.last"
    />
    <div ref="content" class="allowances__content">
      <Item />
    </div>
  </div>
</template>

<script>
import modules from './modules';
import { config, time } from './utils';

export default {
  name: 'Allowances',
  components: {
    ...modules
  },
  data() {
    return {
      isDraw: false,
      date: new Date(),
      arrData: [],
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
      const el = this.$refs.content;
      const width = el.getBoundingClientRect().width;
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
          d.date = lastDate + time.day * (i + 1);
          arrData.push(d);
        }
        if (way === config.way.right) {
          d.date = lastDate - time.day * (i + 1);
          arrData.unshift(d);
        }
      }
    }
  },
  mounted() {
    this.createArrData();
  }
};
</script>

<style lang="scss">
.allowances {
  border: 1px solid;
  box-sizing: border-box;
  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
