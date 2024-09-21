<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Part successfully deleted.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting part.
    </b-alert>

    <b-row>
      <b-col
        v-for="part in parts"
        :key="part.id"
        href="#"
        class="flex-wrap flew-row justify-content-center"
        md="6"
        lg="4"
        xl="3"
      >
        <b-card
          border-variant="dark"
          class="mb-2 card"
          :img-src="part.imgSrc"
          :img-alt="part.name"
          img-height="250rem"
          img-width="auto"
          overlay
        >
          <b-card-body>
            <b-button
              class="button"
              style="right: 45px; padding: 3px 6px"
              v-on:click="deletedPart = part"
              v-b-modal.delete-part-modal
              v-if="admin || store"
            >
              <i class="fa fa-trash" />
            </b-button>
            <b-button
              class="button"
              style="right: 10px; padding: 3px 6px"
              :to="'/parts/edit/' + part.id"
              v-if="admin || store"
            >
              <i class="fa fa-edit" />
            </b-button>

            <div class="info" @click="imageClicked(part)">
              <b-card-title style="font-size: 1.2rem">
                {{ part.name.toUpperCase() }}
              </b-card-title>
            </div>
          </b-card-body>
          <template #footer>
            <div>
              <div style="float: left">
                <span
                  style="font-size: 1rem; font-weight: bold"
                  v-if="part.quantity"
                >
                  {{ part.quantity }} in stock
                </span>
                <span style="font-size: 1rem; font-weight: bold" v-else>
                  Out of stock
                </span>
              </div>
              <div style="float: right">
                <span style="font-size: 1rem; font-weight: bold">
                  {{ part.partKey }}
                </span>
              </div>
            </div>
            <br />
            <div style="float: left">
              <b-badge style="font-size: 1rem">{{ part.categoryName }}</b-badge>
            </div>
            <br />
            <div style="float: right">
              <h2>
                {{
                  Number(part.price).toLocaleString('us-US', {
                    style: 'currency',
                    currency: 'USD',
                  })
                }}
              </h2>
            </div>
            <br />
            <div style="display: inline-flex; float: left">
              <span>
                <div v-if="part.file">
                  <i class="fa fa-link" />
                  <b-link
                    v-if="part.fileSrc"
                    :href="part.fileSrc"
                    :download="part.file.filename"
                    class="mb-2 osu-link"
                  >
                    {{ part.file.filename }}</b-link
                  >
                  <span v-else> File error!</span>
                </div>
              </span>
            </div>
            <div>
              <p v-if="!part.canPurchase" style="float: left; margin: 0">
                Not sold to students
              </p>
            </div>
            <div>
              <b-button
                class="osu-button"
                v-on:click="addToCart(part)"
                v-if="student && teamName !== '' && part.canPurchase"
                :disabled="part.quantity == 0"
                >Add to cart</b-button
              >
            </div>
          </template>
        </b-card>
      </b-col>
    </b-row>

    <b-modal id="image-modal" :title="expandedPartName" hide-footer>
      <img :src="expandedPartSource" style="width: 100%" />
    </b-modal>

    <b-modal id="delete-part-modal" title="Delete Part" hide-footer>
      <DeletePartForm
        :part="deletedPart"
        v-on:update="onDeletePartSuccess"
      ></DeletePartForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DeletePartForm from './DeletePartForm.vue';
import roles from '../../shared/roles';

@Component({
  components: { DeletePartForm },
})
export default class PartList extends Vue {
  @Prop(Array) parts!: Part[];

  showSuccess = false;

  showFailure = false;

  get admin() {
    return roles.admin;
  }

  get student() {
    return roles.student;
  }

  get teamName() {
    return roles.teamName;
  }

  get store() {
    return roles.store;
  }

  addToCart(part: Part) {
    this.$store.dispatch('addPart', {
      name: part.name,
      partKey: part.partKey,
      price: part.price,
      quantityOrdered: 1,
    });
  }

  deletedPart: Part | null = null;
  onDeletePartSuccess() {
    this.$bvModal.hide('delete-part-modal');
    this.showSuccess = true;
    setTimeout(() => {
      this.$emit('update');
    }, 500);
  }

  expandedPartName = '';
  expandedPartSource = '';
  imageClicked(part: Part) {
    this.expandedPartName = part.name.toUpperCase();
    this.expandedPartSource = part.imgSrc;
    this.$bvModal.show('image-modal');
  }
}
</script>

<style scoped>
.padding-0 {
  padding-left: 0px;
  padding-right: 0px;
}

.button {
  position: absolute;
  top: 5px;
  width: 30px !important;
  height: 30px !important;
  background-color: rgba(206, 15, 61, 1);
  padding: 0%;
}

.button:hover {
  background-color: rgba(206, 15, 16, 1);
}

.info {
  vertical-align: text-bottom;
  position: absolute;
  bottom: 0;
  padding: 5px;
  margin: 0px;
  left: 0;
  width: 100%;
  background: rgba(206, 15, 61, 0.75);
  color: whitesmoke;
}

.info:hover {
  background-color: rgba(206, 15, 61, 0.9);
  cursor: pointer;
}

.card-footer {
  padding: 0.25rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.card-title {
  margin-bottom: 0;
}

.card:hover {
  box-shadow: 10px 5px 5px gray;
}

.osu-button {
  width: 100%;
  background-color: rgba(206, 15, 61, 0.9);
}

.osu-button:disabled {
  width: 100%;
  color: white !important;
  background-color: rgba(206, 15, 61, 0.8);
}

.osu-button:hover:enabled {
  width: 100%;
  background-color: rgba(206, 15, 61, 1);
}

.btn-secondary {
  padding: 3px;
}
</style>
