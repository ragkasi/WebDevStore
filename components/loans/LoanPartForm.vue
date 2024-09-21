<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error loaning part! <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <b-alert variant="danger" v-model="showKeycodeFailure" dismissible>
      Error with key code! {{ keycodeFailureReason }}
    </b-alert>

    <b-alert variant="danger" v-model="showPartFailure" dismissible>
      Error with part! {{ partFailureReason }}
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group id="input-group-part-name" label-for="input-part-name">
        <vue-bootstrap-typeahead
          id="input-part-part-name"
          v-model="name"
          placeholder="Part Name"
          :data="partNames"
          :minMatchingChars="1"
          required
        />
      </b-form-group>
      <b-form-group
        id="input-group-key-code"
        label-for="input-part-key-code"
        class="mt-1"
      >
        <b-form-input
          id="input-part-key-code"
          v-model="keycode"
          :state="validKeycode"
          placeholder="Keytag Number"
          required
          autofocus
        ></b-form-input>
      </b-form-group>
      <b-row>
        <b-col style="m-4">
          <b-btn @click="fillMostRecentTeam">Most Recent Team</b-btn>
        </b-col>
        <b-col>
          <b-form-group style="float: right">
            <b-button
              type="submit"
              variant="danger"
              :disabled="!(validKeycode && validPart && keycode.length)"
            >
              Loan Part
            </b-button>
          </b-form-group>
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
export default class LoanPartForm extends Vue {
  @Prop(Array) parts!: Part[];

  partNames: string[] = [];

  name: string = '';
  keycode: string = '';

  validKeycode = false;
  validPart = false;

  showSuccess = false;
  showFailure = false;
  showPartFailure = false;
  showKeycodeFailure = false;

  keycodeFailureReason = '';
  failureReason = '';
  partFailureReason = '';

  @Watch('keycode')
  onKeycodeChanged(val: string) {
    if (val.length == keycodeLength && Number.isInteger(Number(val))) {
      this.validKeycode = true;
      this.showKeycodeFailure = false;
    } else if (val.length > 0) {
      this.showKeycodeFailure = true;
      this.keycodeFailureReason = `Keycodes are integers with ${keycodeLength} digits.`;
    } else {
      this.showKeycodeFailure = false;
      this.keycodeFailureReason = '';
    }
  }

  @Watch('name')
  onNameChanged(val: string) {
    if (this.partNames.indexOf(val) == -1) {
      this.showPartFailure = true;
      this.partFailureReason = 'Valid part not selected.';
      this.validPart = false;
    } else {
      this.showPartFailure = false;
      this.partFailureReason = '';
      this.validPart = true;
    }
  }

  mounted() {
    this.parts.forEach((elem) => {
      this.partNames.push(elem.partKey + ': ' + elem.name);
    });
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    api.checkOut('Part Loan', false, this.name, this.keycode).then((res) => {
      if (res.data?.status == 'success') {
        setMostRecentKeycode(this.keycode);
        this.$emit('update');
      } else {
        this.showFailure = true;
        this.failureReason = res.data.reason;
      }
    });
  }

  clearForm() {
    this.name = '';
    this.keycode = '';
  }

  fillMostRecentTeam() {
    this.keycode = getMostRecentKeycode();
  }
}
</script>
