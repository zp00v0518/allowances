<template>
  <div class="allowances__item">
    <div class="allowances__item__header"></div>
    <div class="allowances__item__content">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Item",
  }
</script>

<style lang="scss" scoped>
.allowances__item{
  display: flex;
  &__header{
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    border: 1px solid;
    border-left: none;
    border-top: none;
  }
  &__content{
    flex: 3;
    width: 100%;
    // border: 1px solid;

  }
}
</style>