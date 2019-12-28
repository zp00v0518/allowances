<template>
  <div class="popup" :style="styles">
    <div>{{data.date}}</div>
    <div>hours: {{data.projects[id]}}</div>
  </div>
</template>

<script>
import { time } from "../utils";

export default {
  name: "Popup",
  props: {
    data: { type: Object, default: () => ({}) },
    position: { type: Object, default: () => ({}) },
    project: { type: Object }
  },
  data() {
    return {
      date: "",
      id: this.project.id
    };
  },
  created() {
    console.log(this.position);
  },
  computed: {
    styles() {
      const { data } = this;
      const result = {
        top: 10 + "px",
        left: data.position.startX + "px"
      };
      console.log(result.left);
      return result;
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        console.log(123);
      }
    },
    "data.position": {
      deep: true,
      immediate: true,
      handler() {
        console.log(123);
      }
    },
    "data.position.endX": {
      deep: true,
      immediate: true,
      handler() {
        console.log(123);
      }
    }
  }
};
</script>

<style lang="scss">
.popup {
  font-size: 10px;
  position: absolute;
  background: white;
  border: 1px solid red;
  z-index: 1;
}
</style>