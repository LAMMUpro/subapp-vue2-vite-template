<template>
  <div>
    <section
      class="-m-card"
      style="text-align: center"
    >
      <MicroComponent
        class="animation"
        _is="UseSvg"
        name="vue"
        size="400px"
      ></MicroComponent>

      <div>vue2+vite子应用首页</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import MicroComponent from 'micro-app-utils/vue2/MicroComponent.vue';

</script>

<style lang="scss" scoped>
@keyframes App-logo-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
.animation {
  display: inline-block;
  animation: App-logo-spin 20s linear infinite;
}
</style>
