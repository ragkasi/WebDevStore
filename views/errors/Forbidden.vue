<template>
  <div>
    <h1>403: Forbidden 🔒</h1>
    <h3>You do not have permission to access this.</h3>
    <h4>If you think this is a mistake, contact your instructor.</h4>
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
export default class Forbidden extends Vue {}
</script>