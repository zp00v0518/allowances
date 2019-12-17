<template>
  <div class="allowances__item">
    <div class="allowances__item__header">
      <div class="allowances__item__header--title">{{ item.name }}</div>
      <div class="allowances__item__header--arrow">
        <span @click="expandItem">></span>
      </div>
    </div>
    <div class="allowances__item__content" ref="content">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Canvas, config, time, h } from '../utils';
import baseFunc from './baseFunc';
import moskData from '../moskData';
let count = 0;
let bigCount = 1000;

export default {
  name: 'Item',
  inheritAttrs: false,
  mixins: [baseFunc],
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 },
    sizeCanvas: { type: Object, default: () => ({ width: 0, height: 0 }) },
    item: { type: Object, default: () => ({}) },
    moskData: { type: Array }
  },
  data() {
    return {
      expandClass: 'expand',
      isNotHeader: true
    };
  },
  methods: {
    drawOneDay({ ctx, startX, startY, width, item }) {
      const day = item.date;
      ctx.fillStyle = 'transparent';
      const cellHeight = ctx.canvas.height;
      const date = new Date(day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.fillStyle = '#f0f0f2';
      }
      ctx.fillRect(startX, 0, width, cellHeight);
      const optionsForBorder = {
        strokeStyle: '#f0f0f2'
      };
      this.drawBorder({
        ctx,
        startX,
        startY: 0,
        width,
        height: cellHeight,
        options: optionsForBorder,
        side: 'lr'
      });
      ctx.fillStyle = 'black';
      item.position = {
        startX,
        endX: startX + width
      };
    },
    darwAllEmployment({ ctx, startDate }) {
      const { canvas, moskData, drawOneEmployment } = this;
      const { cell, zoom } = config;
      const cellHeight = (canvas.$height / 2) * zoom;
      const arrEmpolyment = this.getEmployment();
      if (count < 1) {
        console.log(arrEmpolyment);
      }
      count++;
      arrEmpolyment.forEach(item => {
        drawOneEmployment(item);
      });

      if (count === bigCount) {
        count = 0;
      }
    },
    drawOneEmployment(item) {
      const { canvas, moskData } = this;
      const { hours, startX, endX } = item;
      const ctx = canvas.$ctx;
      ctx.fillRect(startX, 10, endX - startX, 30);
    },
    getEmployment() {
      const { infoArr } = this;
      const { cell, zoom } = config;
      const cellWidth = cell.width * zoom;
      const result = [];

      infoArr.forEach((elem, index) => {
        const key = elem.date;
        const item = elem.projects;
        const position = elem.position;
        const hours = Object.values(item).reduce((acc, i) => (acc += i), 0);
        const template = {
          hours,
          dayCount: 0,
          startX: position.startX,
          endX: position.endX,
          startDay: time.getDateString(new Date(key)),
          endDay: time.getDateString(new Date(key))
        };
        const prev = result[result.length - 1];
        if (!prev) {
          if (hours === 0) return;
          template.dayCount++;
          template.endX = template.startX + cellWidth * template.dayCount;
          result.push(template);
          return;
        }
        const prevDay = time.setMidnight(new Date(key)).getTime() - time.day;
        const checkPrev = time.setMidnight(new Date(prev.endDay)).getTime()
        if (hours === 0 || prevDay === checkPrev) {
          prev.endX = prev.startX + cellWidth * prev.dayCount;
          return;
        };
        if (prev.hours === template.hours) {
          prev.dayCount++;
          prev.endX = prev.startX + cellWidth * prev.dayCount;
          prev.endDay = time.getDateString(new Date(key));
        } else {
          template.dayCount++;
          template.endX = template.startX + cellWidth * template.dayCount;
          template.endDay = time.getDateString(new Date(key));
          result.push(template);
        }
      });
      return result;
    },
    expandItem(event) {
      const target = event.target;
      target.classList.toggle(this.expandClass);
      this.$refs.content.classList.toggle(this.expandClass);
    }
  }
};
</script>

<style lang="scss">
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
    display: flex;
    &--title {
      flex-basis: 80%;
      align-items: center;
      justify-content: center;
    }
    &--arrow {
      font-size: 20px;
      font-weight: 700;
      & > span {
        cursor: pointer;
        display: block;
        transition: 0.5s;
        &.expand {
          transform: rotate(90deg);
          position: relative;
        }
      }
    }
  }
  &__content {
    flex: 3;
    // width: 100%;
    & canvas {
      border: 1px solid;
    }
  }
}
</style>
