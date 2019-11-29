<script>
export default {
  data() {
    return {
      canvas: null,
      isDraw: false,
      timer: null,
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
      },
      requestId: null,
    };
  }
};
</script>
