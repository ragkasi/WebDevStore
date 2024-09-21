<template>
  <div>
    <h1>FEH Robot Store</h1>
    <Particles
      id="particles"
      :options="{
        particles: {
          number: {
            value: particleCount,
            density: {
              enable: true,
              value_area: 250,
            },
          },
          color: {
            value: '#bb0000',
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 3,
              color: '#fff',
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: 'img/github.svg',
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.5,
              sync: false,
            },
          },
          size: {
            value: 16,
            random: true,
            anim: {
              enable: true,
              speed: 20,
              size_min: 1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 250,
            color: '#ffffff',
            opacity: 0.7,
            width: 2,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'window',
          events: {
            onhover: {
              enable: !isMobile,
              mode: 'grab',
            },
            onclick: {
              enable: !isMobile,
              mode: 'repulse',
            },

            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 30,
              duration: 0.5,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 300,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      }"
    />
  </div>
</template>

<style scoped>
h1 {
  font-size: 500%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

#particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #6e6d6d;
  z-index: -100;
}
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Particles from 'particles.vue';
declare module 'particles.vue';
Vue.use(Particles);

@Component({
  components: {},
})
export default class Forbidden extends Vue {
  particleCount = 10;

  isMobile = false;

  mounted() {
    this.determineIfMobileDevice();
  }

  determineIfMobileDevice() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      this.isMobile = true;
      this.particleCount = 5;
    }
  }
}
</script>