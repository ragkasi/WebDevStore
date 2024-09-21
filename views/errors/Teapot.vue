<template>
  <div>
    <h1>418: I'm a Teapot 🫖</h1>
    <h3>You found me! Check the headers...</h3>
    <h3>
      (Yes that is a real
      <a
        class="osu-link"
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418"
        target="_blank"
        >error status code</a
      >)
    </h3>
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
import fun from '../../api/fun';

@Component({
  components: {},
})
export default class Tea extends Vue {
  mounted() {
    fun.getTeapot();
  }
}
</script>
