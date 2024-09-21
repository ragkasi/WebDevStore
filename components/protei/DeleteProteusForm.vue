<template>
  <div>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete Proteus
        <span class="font-weight-bolder">{{ proteus.number }}</span
        >?
      </b-alert>
      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Delete
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import protei from '@/api/protei';
import { failToast } from '@/utils/genericUtils';

@Component({})
export default class DeleteProteusForm extends Vue {
  @Prop(Object) readonly proteus!: Proteus;

  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;
    protei.deleteProteus(this.proteus).then((res) => {
      if (res.success) {
        this.$emit('delete-success');
      } else {
        failToast(this, 'Delete failed, please try again later.');
        this.disableSubmit = false;
      }
    });
  }
}
</script>
