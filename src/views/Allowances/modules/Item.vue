<template>
  <div class="allowances__item" :class="{expandClass: isExpand}">
    <div class="allowances__item__info">
      <div class="allowances__item__info__header">
        <div class="allowances__item__info__header--title">{{ item.name }}</div>
        <div class="allowances__item__info__header--arrow">
          <span @click="expandItem">></span>
        </div>
      </div>
      <div class="allowances__item__info__projects" ref="projects">
        <span v-for="project in item.projects" :key="project.id">{{ project.name }}</span>
      </div>
    </div>
    <div class="allowances__item__content" :class="{expandClass: isExpand}" ref="content">
      <canvas ref="canvas"></canvas>
      <template v-if="isExpand">
        <Project
          v-bind="$props"
          v-for="project in item.projects"
          :key="project.id"
          :project="project"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { Canvas, config, time, h } from "../utils";
import Project from "./Project";
import baseFunc from "./baseFunc";
let count = 0;
let bigCount = 1000;

export default {
  name: "Item",
  inheritAttrs: false,
  mixins: [baseFunc],
  components: { Project },
  props: {
    drawArr: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    endIndex: { type: Number, default: 0 },
    sizeCanvas: { type: Object, default: () => ({ width: 0, height: 0 }) },
    item: { type: Object, default: () => ({}) },
    moskData: { type: Array },
    swipe: {type: Object}
  },
  data() {
    return {
      expandClass: "expand",
      isNotHeader: true,
      isExpand: false
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
        // console.log(this.canvas.getRandomColor());
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
      const { canvas, getTxtForEmployment, drawTxt } = this;
      const { hours, startX, endX } = item;
      const ctx = canvas.$ctx;
      ctx.fillStyle = "black";
      const width = endX - startX;
      canvas.roundRect(startX + 1, 10, width - 1, 30, 4, true);
      // ctx.fillRect(startX + 1, 10, width - 1, 30);
      const font = Math.round(10 + config.zoom);
      const options = {
        fillStyle: "white",
        font: `normal ${font}px Avenir Helvetica`
      };
      const txt = getTxtForEmployment(hours);
      drawTxt({
        ctx,
        startX: startX + 1,
        startY: 10,
        width: width - 1,
        height: 30,
        txt,
        options
      });
      ctx.fillStyle = "";
    },
    getTxtForEmployment(hours) {
      const { itemIndex, moskData } = this;
      const data = moskData[itemIndex];
      const { settings } = data;
      const { full } = settings;
      let result = "cvcb";
      const dif = full - hours;
      result = dif <= 0 ? "Full" : `${dif} free`;
      return result;
    },
    getEmployment() {
      const { infoArr } = this;
      const { cell, zoom } = config;
      const cellWidth = cell.width * zoom;
      const result = [];

      infoArr.forEach((elem, index) => {
        const dayKey = elem.date;
        const projects = elem.projects;
        const position = elem.position;
        const hours = Object.values(projects).reduce((acc, i) => (acc += i), 0);
        const template = {
          hours,
          dayCount: 0,
          startX: position.startX,
          endX: position.endX,
          startDay: dayKey,
          endDay: dayKey
        };
        const prev = result[result.length - 1];
        if (!prev) {
          if (hours === 0) return;
          template.dayCount++;
          template.endX = template.startX + cellWidth * template.dayCount;
          result.push(Object.assign({}, template));
          return;
        }
        const yesterday = time.getDateString(
          time.setPastDate(new Date(dayKey), 1)
        );
        if (hours === 0) {
          prev.endX = prev.startX + cellWidth * prev.dayCount;
          return;
        }
        if (prev.hours === template.hours && yesterday === prev.endDay) {
          prev.dayCount++;
          prev.endX = prev.startX + cellWidth * prev.dayCount;
          prev.endDay = dayKey;
        } else {
          template.dayCount++;
          template.endX = template.startX + cellWidth * template.dayCount;
          template.endDay = dayKey;
          result.push(Object.assign({}, template));
        }
      });
      return result;
    },
    expandItem(event) {
      this.isExpand = !this.isExpand;
      const target = event.target;
      target.classList.toggle(this.expandClass);
      const { $el } = this;
      const { projects } = this.$refs;
      const style = projects.getBoundingClientRect();
      const elStyle = $el.getBoundingClientRect();
      const computedHeight = this.isExpand
        ? style.height + elStyle.height
        : elStyle.height - style.height;
      $el.style.height = computedHeight + "px";
    }
  },
};
</script>

<style lang="scss">
.allowances__item {
  display: flex;
  height: 50px;
  transition: 0.2s;
  &__content {
    flex: 3;
    overflow: hidden;
    display: grid;
    // width: 100%;
    & canvas {
      // border: 1px solid;
      border-left: none;
      border-right: none;
      border-top: none;
    }
  }
  &__info {
    // display: flex;
    // flex-direction: column;
    border: 1px solid;
    border-left: none;
    border-top: none;
    box-sizing: border-box;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    overflow: hidden;
    &__header {
      display: flex;
      height: 50px;
      &--title {
        flex-basis: 80%;
        align-items: center;
        justify-content: center;
        display: flex;
      }
      &--arrow {
        font-size: 20px;
        font-weight: 700;
        align-items: center;
        justify-content: center;
        display: flex;
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
    &__projects {
      flex-direction: column;
      display: flex;
      & span {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
