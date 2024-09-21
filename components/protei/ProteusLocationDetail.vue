<template>
  <div>
    <div>
      <div v-if="['Team'].includes(base.location)">
        <a
          v-bind:href="'/teams/' + base.team.name"
          class="osu-link"
          v-if="base.team"
          >{{ base.team.name }}
        </a>
        <div v-else>✖ Removed ✖</div>
      </div>
      <div v-if="['TA'].includes(base.location)">
        <div v-if="base.user">
          {{ base.user.fullName }}
        </div>
        <div v-else>✖ Removed ✖</div>
      </div>
      <div
        v-if="['Store'].includes(base.location)"
        v-bind:class="{
          'truncate-wrap': truncate && wrap,
          'truncate-nowrap': truncate && !wrap,
        }"
      >
        {{ base.storeLocationDetails }}
      </div>
      <div
        v-if="['Other'].includes(base.location)"
        v-bind:class="{
          'truncate-wrap': truncate && wrap,
          'truncate-nowrap': truncate && !wrap,
        }"
      >
        {{ base.otherLocationDetails }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class ProteusLocationDetail extends Vue {
  @Prop(Object) readonly base!: BaseProteus;
  @Prop({ default: true }) readonly truncate!: boolean;
  @Prop({ default: false }) readonly wrap!: boolean;
}
</script>

<style scoped>
.truncate-nowrap {
  max-width: 25vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-wrap {
  max-width: 25vw;
}
</style>
