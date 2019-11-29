<template>
  <div class="allowances">
    <Header/>
  </div>
</template>

<script>
import modules from './modules'
export default {
  name: 'Allowances',
  components: {
    ...modules
  }
};
</script>

<style lang="scss">
.allowances {
  border: 1px solid;
  box-sizing: border-box;
}
</style>
