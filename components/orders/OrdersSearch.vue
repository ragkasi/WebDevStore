<template>
  <b-form inline class="align-items-centered">
    <b-form-group class="mb-2 mr-2">
      <b-form-input
        v-model="text"
        type="text"
        placeholder="Search"
      ></b-form-input>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class OrdersSearch extends Vue {
  @Prop(Array) orders!: Order[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Order[] = [];
    this.orders?.forEach((elem) => {
      if (
        !(
          new Date(elem.dateSubmitted)
            .toLocaleString()
            .toLowerCase()
            .includes(val) ||
          elem.team.toLowerCase().includes(val) ||
          Number(elem.totalCost)
            .toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
            .includes(val)
        )
      ) {
        toRemove.push(elem);
      }
    });
    const shownOrders = Array.from(this.orders);
    toRemove?.forEach((elem) => {
      const index = shownOrders.indexOf(elem);
      if (index !== -1) {
        shownOrders.splice(index, 1);
      }
    });

    this.$emit('update', shownOrders);
  }
}
</script>
