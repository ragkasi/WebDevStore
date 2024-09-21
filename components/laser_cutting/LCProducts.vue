<template>
  <div>
    <div class="loader" v-if="!hasMounted" />
    <b-card no-body class="m-2" v-else>
      <b-card-body>
        <h5 style="margin: 0px">Laser Cutting</h5>
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
          <span class="fee-label">Subtotal:</span>${{
            Number(subtotal).toFixed(2)
          }}
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
            <b-row>
              <b-col>
                <small
                  ><b>Material:</b>
                  {{ getMaterialType(prod.data.materialType) }}
                </small>
              </b-col>
              <b-col>
                <small
                  ><b>Path Length:</b>
                  {{ Number(prod.data.length).toFixed(2) }} inches</small
                >
              </b-col>
              <b-col>
                <small
                  ><b>Area:</b>
                  {{ Number(prod.data.area).toFixed(2) }} inches<sup
                    >2</sup
                  ></small
                >
              </b-col>
            </b-row>
            <div>
              <small v-if="isNotNull(files[idx])">
                <i class="fa fa-link" />
                <b-link
                  :href="files[idx].src"
                  :download="files[idx].filename"
                  class="mb-2 osu-link"
                >
                  {{ files[idx].filename }}</b-link
                >
              </small>
              <small v-else>
                <b>DXF file not found.</b>
              </small>
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
                >
                  <i class="fa fa-trash" />
                </b-button>
                <span>&ensp;</span>
                <b-button
                  class="button"
                  variant="danger"
                  style="padding: 3px 6px"
                  @click="showEditLaserModal(prod.id)"
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
      id="editLaserModal"
      ref="editLaserModal"
      title="Edit Laser Cut Part"
      hide-footer
    >
      <EditLasercutForm
        :order="order"
        :laserId="laserId"
        v-on:close="
          () => {
            this.$refs['editLaserModal'].hide();
          }
        "
        v-on:update="
          () => {
            this.$emit('update');
          }
        "
      ></EditLasercutForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { productMaterialTypes, statusOptions } from '../../utils/config';
import products from '../../api/products';
import roles from '@/shared/roles';
import Store from '@/shared/store';
import EditLasercutForm from '../../components/laser_cutting/EditLasercutForm.vue';
import { getPriceLaserCutting } from '@/utils/genericUtils';

@Component({
  components: {
    EditLasercutForm,
  },
})
export default class LCProducts extends Vue {
  showSuccess = false;

  hasMounted = false;

  showFailure = false;

  laserId = ';';

  @Prop() readonly order!: Order[];

  @Prop(Array) readonly products!: LaserCutProduct[];

  @Prop(Boolean) readonly inCart!: boolean;

  files: { src: string; filename: string }[] = [];

  mounted() {
    this.files = new Array(this.products.length);
    this.hasMounted = false;
    if (!this.inCart) {
      Promise.all(
        this.products.map(async (elem: Product, idx: number) => {
          products.getFiles(elem.id).then((res) => {
            if (res.data.status == 'success' && res.data.body) {
              this.$set(this.files, idx, {
                src: res.data.body[0]?.src,
                filename: res.data.body[0]?.filename,
              });
            }
          });
        }),
      ).then(() => {
        this.hasMounted = true;
      });
    } else {
      this.products.map(async (elem: Product, idx: number) => {
        if (elem) {
          this.$set(this.files, idx, JSON.parse(Store.get(`${elem.id}-dxf`)));
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
          .map((elem) => getPriceLaserCutting(elem) * elem.data.quantity)
          .reduce((a, b) => a + b),
    );
  }

  getProdPrice(prod: Product) {
    return getPriceLaserCutting(prod);
  }

  getMaterialType(val: number) {
    return productMaterialTypes.filter((elem) => elem.value == val)[0].text;
  }

  getStatusString(val: number) {
    return statusOptions.filter((elem) => elem.value == val)[0].text;
  }

  removeAll() {
    if (this.inCart) {
      this.products.forEach((prod) => {
        Store.remove(`${prod.id}-dxf`);
        this.$store.dispatch('removeProduct', prod);
      });
    } else {
      this.$emit('removeAll', 1);
    }
  }

  removeOne(id: string) {
    this.$emit('removeOne', id);
  }

  isNotNull(obj: { src: string; filename: string }) {
    return obj && obj.src && obj.filename;
  }

  showEditLaserModal(id: string) {
    if (this.products.length) {
      this.laserId = id;
      (this.$refs['editLaserModal'] as Vue & { show: () => boolean }).show();
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
