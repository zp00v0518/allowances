<script>
import { Canvas, config, time, h } from '../utils';

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
      this.canvas.setSize(size);
    },
    draw(timestamp) {
      const now = new Date().getTime();
      if (!this.timer) {
        this.timer = now;
      }
      const progress = now - this.timer;
      if (progress > 50) {
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
    drawBorder({ ctx, startX, startY, width, height, day }) {
      const date = new Date(day).getDate();
      ctx.beginPath();
      if (date !== 1) {
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX + width, startY + height);
        ctx.lineTo(startX, startY + height);
      } else {
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, ctx.canvas.height);
        ctx.lineTo(startX + width, ctx.canvas.height);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX, startY);
      }
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
      txt = '',
      align = 'center',
      size = 10
    }) {
      let x = startX;
      let y = startY;
      ctx.textAlign = align;
      if (align === 'center') {
        x += width / 2;
        y += height / 2;
        ctx.textBaseline = 'middle';
      }
      if (size) {
        const font = Math.round(size + config.zoom);
        ctx.font = font + 'px Nunito';
      }
      ctx.fillText(txt, x, y);
    }
  },
  mounted() {
    this.init();
    requestAnimationFrame(this.draw);
  },
  beforeMount() {
    cancelAnimationFrame(this.requestID);
  }
};
</script>
