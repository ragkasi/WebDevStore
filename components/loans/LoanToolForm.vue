<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Tool loaned!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error loaning tool! <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <b-alert variant="danger" v-model="showKeycodeFailure" dismissible>
      Error with key code! {{ keycodeFailureReason }}
    </b-alert>

    <b-form @submit="onSubmit">
      <h4>{{ name }}</h4>
      <br />
      <b-form-group
        id="input-group-tool-number"
        label-for="input-tool-number"
        v-if="requireItemNumber"
      >
        <b-form-input
          id="input-tool-number"
          v-model="toolNumber"
          placeholder="Tool Number"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-key-code" label-for="input-part-key-code">
        <b-form-input
          id="input-part-key-code"
          v-model="keycode"
          placeholder="Keytag Number"
          :state="validKeycode"
          required
          autofocus
        ></b-form-input>
      </b-form-group>

      <b-row>
        <b-col>
          <b-btn text-start @click="fillMostRecentTeam">Most Recent Team</b-btn>
        </b-col>
        <b-col>
          <b-form-group style="float: right">
            <b-btn type="submit" variant="danger" :disabled="disableSubmit">
              Loan Tool
            </b-btn>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '../../api/loans';
import students from '../../api/students';
import {
  getMostRecentKeycode,
  setMostRecentKeycode,
} from '../../utils/genericUtils';
import { keycodeLength } from '../../utils/config';

@Component({})
export default class LoanToolForm extends Vue {
  @Prop(Boolean) requireItemNumber!: boolean;
  @Prop(String) name!: string;
  @Prop(String) id!: string;

  toolNumber = '';
  keycode = '';

  validKeycode = false;
  disableSubmit = false;

  failureReason = '';
  keycodeFailureReason = '';

  showSuccess = false;
  showFailure = false;
  showKeycodeFailure = false;

  @Watch('keycode')
  onKeycodeChanged(val: string) {
    this.validKeycode = false;
    if (val.length == keycodeLength && Number.isInteger(Number(val))) {
      students.checkKeycode(val).then((res) => {
        if (res.data?.status == 'success') {
          this.validKeycode = true;
          this.showKeycodeFailure = false;
          this.keycodeFailureReason = '';
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
    api.checkOut(this.name, true, this.toolNumber, this.keycode).then((res) => {
      if (res.data?.status == 'success') {
        setMostRecentKeycode(this.keycode);
        this.showSuccess = true;
        this.$emit('update', this.id);
      } else {
        this.showFailure = true;
        this.failureReason = res.data?.reason;
      }
      this.disableSubmit = false;
    });
  }

  clearForm() {
    this.toolNumber = '';
    this.keycode = '';
  }

  fillMostRecentTeam() {
    this.keycode = getMostRecentKeycode();
  }
}
</script>
