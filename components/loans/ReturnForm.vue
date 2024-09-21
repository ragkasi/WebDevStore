<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error returning tools! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-alert variant="danger" v-model="showKeycodeFailure" dismissible>
      Error with key code! {{ keycodeFailureReason }}
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-key-code"
        label-for="input-part-key-code"
        class="mt-1"
      >
        <b-form-input
          id="input-part-key-code"
          v-model="keycode"
          placeholder="Keytag Number"
          :state="validKeycode"
          required
          autofocus
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-loaned-items"
        label-for="input-loaned-items"
      >
        <multiselect
          id="input-loaned-items"
          v-model="returningItems"
          :options="options"
          :multiple="true"
          :searchable="false"
          :close-on-select="false"
          :clear-on-select="false"
          :show-labels="false"
          label="label"
          track-by="value"
          placeholder="Pick a item to return"
        ></multiselect>
      </b-form-group>
      <b-row>
        <b-col style="m-4">
          <b-btn @click="fillMostRecentTeam">Most Recent Team</b-btn>
        </b-col>
        <b-col>
          <div style="float: right">
            <b-btn
              type="submit"
              variant="danger"
              :disabled="returningItems.length == 0 || disableSubmit"
            >
              Return Tools
            </b-btn>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '../../api/loans';
import {
  getMostRecentKeycode,
  setMostRecentKeycode,
} from '../../utils/genericUtils';
import { keycodeLength } from '../../utils/config';

@Component({})
export default class ReturnForm extends Vue {
  @Prop(Array) tools!: Tool[];

  returningItems: { label: string; value: string }[] = [];

  options: { label: string; value: string }[] = [];

  keycode = '';
  keycodeFailureReason = '';
  failureReason = '';

  validKeycode = false;

  showSuccess = false;
  showFailure = false;
  showKeycodeFailure = false;

  disableSubmit = false;

  @Watch('keycode')
  onKeycodeChanged(val: string) {
    this.returningItems = [];
    this.options = [];
    this.validKeycode = false;

    if (val.length == keycodeLength && Number.isInteger(Number(val))) {
      api.getLoansByKeycode(val).then((res) => {
        if (res.data?.status == 'success') {
          this.validKeycode = true;
          this.showKeycodeFailure = false;
          this.keycodeFailureReason = '';
          const loans = res.data.loans;

          loans.forEach((elem: Loan) => {
            if (elem.lost) {
              return;
            } else if (elem.Tool) {
              let label = elem.Tool.name;
              if (elem.Tool.requireItemNumber) {
                label += ' (' + elem.description + ')';
              }
              this.options.push({
                label: label,
                value: elem.id,
              });
            } else if (elem.Part) {
              this.options.push({
                label: elem.Part.partKey + ': ' + elem.Part.name,
                value: elem.id,
              });
            }
          });
        } else {
          this.showKeycodeFailure = true;
          this.keycodeFailureReason = res.data.reason;
        }
      });
    } else if (val.length > 0) {
      this.showKeycodeFailure = true;
      this.keycodeFailureReason = `Keycodes are integers with ${keycodeLength} digits.`;
    } else {
      this.showKeycodeFailure = false;
      this.keycodeFailureReason = '';
    }
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;
    let itemIds: string[] = [];
    this.returningItems.forEach((elem) => {
      itemIds.push(elem.value as string);
    });
    api.checkIn(itemIds).then((res) => {
      if (res.data?.status == 'success') {
        setMostRecentKeycode(this.keycode);
        this.$emit('update');
      } else {
        this.showFailure = true;
        this.failureReason = res.data?.reason;
      }
      this.disableSubmit = false;
    });
  }

  clearForm() {
    this.keycode = '';
  }

  fillMostRecentTeam() {
    this.keycode = getMostRecentKeycode();
  }
}
</script>
