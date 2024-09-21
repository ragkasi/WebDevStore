<template>
  <div>
    <h1>402: Overdue Loans 🛠</h1>
    <h3>The following are your team's overdue items:</h3>
    <br />
    <ul>
      <li v-for="item in overdue" :key="item.item">
        <h4>{{ item.item }}</h4>
      </li>
    </ul>
  </div>
</template>

<style scoped>
div {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

li {
  text-align: left;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../../api/loans';
import roles from '../../shared/roles';

@Component({
  components: {},
})
export default class OverdueLoans extends Vue {
  overdue: string[] = [];

  get teamName() {
    return roles.teamName;
  }

  mounted() {
    api.getOverdueLoans(this.teamName).then((res) => {
      this.overdue = res.data;
    });
  }
}
</script>
