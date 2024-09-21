<template>
  <div>
    <b-card no-body class="m-2">
      <b-card-body>
        <h5 style="margin: 0px">Parts</h5>
        <b-table
          id="ordered-parts-table"
          hover
          :items="orderedParts"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          responsive="sm"
        >
          <template #cell(name)="data">
            <h5 style="margin: 0px">{{ data.item.name }}</h5>
            <small style="color: #666666">{{ data.item.partKey }}</small>
          </template>

          <template #cell(price)="data">
            {{
              Number(data.value).toLocaleString('us-US', {
                style: 'currency',
                currency: 'USD',
              })
            }}
          </template>

          <template #cell(quantityOrdered)="data">
            <div style="width: 75px">
              <b-form-input
                :number="true"
                type="number"
                v-model="quantity[data.index]"
                min="1"
                step="1"
                required
                @change="updateQuantity(data.item.name, quantity[data.index])"
              ></b-form-input>
            </div>
          </template>

          <template #cell(subtotal)="data">
            {{
              Number(data.item.price * quantity[data.index]).toLocaleString(
                'us-US',
                {
                  style: 'currency',
                  currency: 'USD',
                },
              )
            }}
          </template>

          <template #cell(actions)="data">
            <b-button
              class="button"
              variant="danger"
              style="padding: 3px 6px"
              @click="onRemove(data.item, data.index)"
            >
              <i class="fa fa-trash" />
            </b-button>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class OrderedPartList extends Vue {
  @Prop(Array) orderedParts!: Part[];
  quantity: number[] = [];

  mounted() {
    this.quantity = this.orderedParts.map((e) => Number(e.quantityOrdered));
  }

  perPage = 50;
  currentPage = 1;

  fields = [
    { key: 'name', label: 'Product', sortable: false },
    { key: 'price', label: 'Price', sortable: false },
    { key: 'quantityOrdered', label: 'Quantity', sortable: false },
    { key: 'subtotal', label: 'Subtotal', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  updateQuantity(name: string, quantity: number) {
    this.$store.dispatch('setPartQuantity', {
      name: name,
      quantityOrdered: quantity,
    });
  }

  onRemove(part: Part, idx: number) {
    this.$store.dispatch('removePart', part);
    this.quantity.splice(idx, 1);
  }
}
</script>

<style>
.table td {
  vertical-align: middle !important;
}
</style>
