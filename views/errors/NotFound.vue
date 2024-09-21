<template>
  <div>
    <h1>404: Not Found 🔎</h1>
    <h3>These aren't the droids you are looking for.</h3>
    <h4></h4>
  </div>
</template>

<style scoped>
div {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class NotFound extends Vue {}
</script>