<script>
import { Canvas, config, time, h } from "../utils";

export default {
  data() {
    return {
      canvas: null,
      requestId: null
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
        this.canvas.clear();
        const startDate = this.drawArr[this.startIndex].date;
        this.drawAllDays({ ctx: this.canvas.$ctx, startDate });
        this.timer = now;
      }
      this.requestId = requestAnimationFrame(this.draw);
    },
    drawAllDays({ ctx, startDate }) {
      const { canvas, startIndex, endIndex } = this;
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
          day: item.date
        });
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
  beforeMount() {
    cancelAnimationFrame(this.requestID);
  }
};
</script>
