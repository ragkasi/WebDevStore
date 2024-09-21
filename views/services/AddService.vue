<template>
  <div>
    <h2>Services</h2>
    <hr />
    <!-- <b-alert show variant="danger">
      The service submission page is currently down for maintenance. Check back
      later to submit your service requests. If you have previously submitted
      service orders, these will still be completed during this down time.
    </b-alert> -->
    <b-card no-body>
      <b-tabs card>
        <b-tab title="3D Printing" active>
          <PRAddProduct></PRAddProduct>
        </b-tab>
        <b-tab title="Laser Cutting">
          <LCAddProduct></LCAddProduct>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PRAddProduct from '../../components/3d_printing/PRAddProduct.vue';
import LCAddProduct from '../../components/laser_cutting/LCAddProduct.vue';

@Component({ components: { PRAddProduct, LCAddProduct } })
export default class AddService extends Vue {}
</script>
