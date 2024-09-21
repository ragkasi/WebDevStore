<template>
  <div>
    <div class="loader" v-if="!hasMounted" />
    <b-card no-body class="m-2" v-else>
      <b-card-body>
        <h5 style="margin: 0px">3D Printing</h5>
        <small>Service</small>
        <div style="float: right" v-if="inCart || admin || store">
          <b-button
            class="button"
            variant="danger"
            style="padding: 3px 6px"
            @click="removeAll()"
          >
            <i class="fa fa-trash" />
          </b-button>
        </div>
        <div><span class="fee-label">Setup Fee:</span>$1.50</div>
        <div>
          <span class="fee-label">Total Weight:</span
          >{{ totalWeight.toFixed(2) }} grams
        </div>
        <div>
          <span class="fee-label">Subtotal:</span>${{ subtotal.toFixed(2) }}
        </div>
        <br />
        <b-row v-for="(prod, idx) in products" :key="prod.id">
          <b-col class="product-border" v-if="inCart || (!inCart && files)">
            <div>
              <div style="float: left">
                <small><b>Quantity:</b> {{ prod.data.quantity }}</small>
              </div>
              <div style="float: right">
                <small
                  ><b
                    >${{
                      Number(getProdPrice(prod) * prod.data.quantity).toFixed(2)
                    }}</b
                  ></small
                >
              </div>
            </div>
            <br />
            <div style="float: left">
              <small
                ><b>Weight:</b>
                {{ Number(prod.data.weight).toFixed(2) }} grams</small
              >
            </div>
            <br />
            <div>
              <div>
                <small v-if="isNotNull(files[2 * idx])">
                  <i class="fa fa-link" />
                  <b-link
                    :href="files[2 * idx].src"
                    :download="files[2 * idx].filename"
                    class="mb-2 osu-link"
                  >
                    {{ files[2 * idx].filename }}</b-link
                  >
                </small>
                <small v-else>
                  <b>STL file not found.</b>
                </small>
              </div>
              <div>
                <small v-if="isNotNull(files[2 * idx + 1])">
                  <i class="fa fa-link" />
                  <b-link
                    :href="files[2 * idx + 1].src"
                    :download="files[2 * idx + 1].filename"
                    class="mb-2 osu-link"
                  >
                    {{ files[2 * idx + 1].filename }}</b-link
                  >
                </small>
                <small v-else>
                  <b>SLDPRT file not found.</b>
                </small>
              </div>
            </div>
            <small><b>Description:</b> {{ prod.data.description }}</small>
            <div v-if="(admin || store) && !inCart">
              <br />
              <b-button-group style="float: left">
                <b-button
                  @click="
                    () => {
                      prod.data.status = 0;
                    }
                  "
                  :pressed="prod.data.status == 0"
                  variant="outline-danger"
                  size="sm"
                  >Placed</b-button
                >
                <b-button
                  @click="
                    () => {
                      prod.data.status = 5;
                    }
                  "
                  :pressed="prod.data.status == 5"
                  variant="outline-danger"
                  size="sm"
                  >In Progress</b-button
                >
                <b-button
                  @click="
                    () => {
                      prod.data.status = 1;
                    }
                  "
                  :pressed="prod.data.status == 1"
                  variant="outline-danger"
                  size="sm"
                  >Filled</b-button
                >
                <b-button
                  @click="
                    () => {
                      prod.data.status = 2;
                    }
                  "
                  :pressed="prod.data.status == 2"
                  variant="outline-danger"
                  size="sm"
                  >Picked Up</b-button
                >
              </b-button-group>
              <div style="float: right">
                <b-button
                  class="button"
                  variant="danger"
                  style="padding: 3px 6px"
                  @click="removeOne(prod.id)"
                >
                  <i class="fa fa-trash" />
                </b-button>
                <span>&ensp;</span>
                <b-button
                  class="button"
                  variant="danger"
                  style="padding: 3px 6px"
                  @click="showEditPrintedModal(prod.id)"
                >
                  <i class="fa fa-edit" />
                </b-button>
              </div>
              <br />
              <br />
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-modal
      id="editPrintedModal"
      ref="editPrintedModal"
      title="Edit 3D Printed Part"
      hide-footer
    >
      <EditPrintedForm
        :order="order"
        :printedId="printedId"
        v-on:close="
          () => {
            this.$refs['editPrintedModal'].hide();
          }
        "
        v-on:update="
          () => {
            this.$emit('update');
          }
        "
      ></EditPrintedForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { statusOptions } from '../../utils/config';
import products from '../../api/products';
import roles from '@/shared/roles';
import Store from '@/shared/store';
import EditPrintedForm from '../../components/3d_printing/EditPrintedForm.vue';
import { getPricePrinting } from '@/utils/genericUtils';

@Component({
  components: {
    EditPrintedForm,
  },
})
export default class PRProducts extends Vue {
  showSuccess = false;

  hasMounted = false;

  showFailure = false;

  printedId: string = '';

  @Prop() readonly order!: Order[];

  @Prop(Array) readonly products!: PrintedProduct[];

  @Prop(Boolean) readonly inCart!: boolean;

  files: { src: string; filename: string }[] = [];

  mounted() {
    this.files = new Array(this.products.length * 2);
    this.hasMounted = false;
    if (!this.inCart) {
      this.products.map((elem: Product, idx: number) => {
        products.getFiles(elem.id).then((res) => {
          if (res.data.status == 'success' && res.data.body) {
            this.$set(this.files, 2 * idx, {
              src: res.data.body[0]?.src,
              filename: res.data.body[0]?.filename,
            });

            this.$set(this.files, 2 * idx + 1, {
              src: res.data.body[1]?.src,
              filename: res.data.body[1]?.filename,
            });
          }
        });
      });
      this.hasMounted = true;
    } else {
      this.products.map((elem: Product, idx: number) => {
        if (elem) {
          this.$set(
            this.files,
            2 * idx,
            JSON.parse(Store.get(`${elem.id}-stl`)),
          );
          this.$set(
            this.files,
            2 * idx + 1,
            JSON.parse(Store.get(`${elem.id}-sw`)),
          );
        }
      });
      this.hasMounted = true;
    }
  }

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  get subtotal() {
    return Number(
      1.5 +
        this.products
          .map((elem) => getPricePrinting(elem) * elem.data.quantity)
          .reduce((a, b) => a + b),
    );
  }

  getProdPrice(prod: Product) {
    return getPricePrinting(prod);
  }

  get totalWeight() {
    return this.products
      .map((elem) => elem.data.weight * elem.data.quantity)
      .reduce((a, b) => a + b);
  }

  getStatusString(val: number) {
    return statusOptions.filter((elem) => elem.value == val)[0].text;
  }

  removeAll() {
    if (this.inCart) {
      this.products.forEach((prod) => {
        Store.remove(`${prod.id}-stl`);
        Store.remove(`${prod.id}-sw`);
        this.$store.dispatch('removeProduct', prod);
      });
    } else {
      this.$emit('removeAll', 0);
    }
  }

  removeOne(id: string) {
    this.$emit('removeOne', id);
  }

  isNotNull(obj: { src: string; filename: string }) {
    return obj && obj.src && obj.filename;
  }

  showEditPrintedModal(id: string) {
    if (this.products.length) {
      this.printedId = id;
      (this.$refs['editPrintedModal'] as Vue & { show: () => boolean }).show();
    }
  }
}
</script>

<style>
.fee-label {
  width: 8rem;
  display: inline-block;
  margin-top: 10px;
  font-weight: 500;
}
.product-border {
  border: 0.25px solid;
  border-color: rgb(209, 209, 209);
  border-radius: 10px;
  margin: 5px;
}
</style>
