<script>
import { Canvas, config, time, h } from "../utils";
import moskData from "../moskData";
let count = 0;
let bigCount = 1000;

export default {
  props: {
    itemIndex: { type: Number }
  },
  data() {
    return {
      canvas: null,
      requestId: null,
      infoArr: []
    };
  },
  methods: {
    init() {
      this.canvas = new Canvas(this.$refs.canvas);
      const size = h.getSizeContainer(this.$refs.canvas.parentElement);
      size.width = this.sizeCanvas.width;
      this.canvas.setSize(size);
    },
    draw(timestamp) {
      const now = new Date().getTime();
      if (!this.timer) {
        this.timer = now;
      }
      const progress = now - this.timer;
      if (progress > config.progress) {
        const { infoArr, canvas } = this;
        canvas.clear();
        infoArr.length = 0;
        const startDate = this.drawArr[this.startIndex].date;
        this.drawAllDays({ ctx: this.canvas.$ctx, startDate });
        if (this.isNotHeader) {
          this.darwAllEmployment({ ctx: this.canvas.$ctx, startDate });
        }
        this.timer = now;
        count++;
      }
      this.requestId = requestAnimationFrame(this.draw);
      if (count === bigCount) {
        count = 0;
      }
    },
    drawAllDays({ ctx, startDate }) {
      const { canvas, startIndex, endIndex, setInfoArr } = this;
      const { cell, zoom } = config;
      const cellWidth = cell.width * zoom;
      const cellHeight = (canvas.$height / 2) * zoom;
      let count = 0;
      for (let i = startIndex; i < endIndex; i++) {
        const item = this.drawArr[i];
        this.drawOneDay({
          ctx,
          startX: count * cellWidth,
          startY: canvas.$height / 2,
          width: cellWidth,
          height: cellHeight,
          item
        });
        if (this.isNotHeader) {
          setInfoArr(item);
        }
        count++;
      }
    },
    drawBorder({
      ctx,
      startX,
      startY,
      width,
      height,
      side = "trbl",
      options = {}
    }) {
      Object.assign(ctx, options);
      ctx.beginPath();
      if (side.includes("t")) {
        drawTopBorder();
      }
      if (side.includes("r")) {
        drawRightBorder();
      }
      if (side.includes("b")) {
        drawBottomBorder();
      }
      if (side.includes("l")) {
        drawLeftBorder();
      }
      ctx.beginPath();
      function drawLeftBorder() {
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, startY + height);
        ctx.stroke();
      }
      function drawTopBorder() {
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + width, startY);
        ctx.stroke();
      }
      function drawBottomBorder() {
        ctx.moveTo(startX, startY + height);
        ctx.lineTo(startX + width, startY + height);
        ctx.stroke();
      }
      function drawRightBorder() {
        ctx.moveTo(startX + width, startY);
        ctx.lineTo(startX + width, startY + height);
        ctx.stroke();
      }
    },
    drawTxt({
      ctx,
      startX,
      startY,
      width,
      height,
      txt = "",
      align = "center",
      options
    }) {
      Object.assign(ctx, options);
      let x = startX;
      let y = startY;
      ctx.textAlign = align;
      if (align === "center") {
        x += width / 2;
        y += height / 2;
        ctx.textBaseline = "middle";
      }
      ctx.fillText(txt, x, y);
    },
    setInfoArr(item) {
      const { moskData, itemIndex, infoArr } = this;
      const data = moskData[itemIndex].data;
      const key = item.date;
      let elem = data[key];
      if (elem) {
        elem.position = item.position;
        elem.date = time.getDateString(new Date(key));
        infoArr.push(elem);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.init();
        requestAnimationFrame(this.draw);
      }, 200);
    });
  },
  beforeDestroy() {
    cancelAnimationFrame(this.requestID);
  }
};
</script>
