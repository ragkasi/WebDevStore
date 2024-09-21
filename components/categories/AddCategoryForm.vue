<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Category Added!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding category! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-category-name"
        label-for="input-category-name"
      >
        <b-form-input
          id="input-category-name"
          v-model="name"
          placeholder="Category Name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group style="float: right">
        <b-button type="submit" variant="danger"> Add </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../../api/categories';
@Component({})
export default class AddCategoryForm extends Vue {
  name: string = '';

  showSuccess = false;
  showFailure = false;

  failureReason = '';

  onSubmit(evt: Event) {
    evt.preventDefault();
    api.postCategory(this.name).then((res) => {
      if (res.data?.status == 'success') {
        this.showSuccess = true;
        this.name = '';
        this.$emit('refresh');
      } else {
        this.showFailure = true;
        this.failureReason = res.data.reason;
      }
    });
  }
}
</script>
