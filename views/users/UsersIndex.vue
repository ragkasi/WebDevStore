<template>
  <div>
    <h2>Users</h2>
    <hr />

    <b-card no-body>
      <b-tabs card>
        <b-tab title="Staff" active title-link-class="osu-link">
          <Staff></Staff>
          <br />
        </b-tab>
        <b-tab title="Students" title-link-class="osu-link">
          <Students></Students>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import roles from '../../shared/roles';
import Staff from '../../components/users/staff/Staff.vue';
import Students from '../../components/users/students/Students.vue';

@Component({
  components: {
    Staff,
    Students,
  },
})
export default class UsersIndex extends Vue {
  showFailure = false;

  mounted() {
    if (roles.student) {
      this.$router.push('/forbidden');
    }
  }

  get admin() {
    return roles.admin;
  }

  get ta() {
    return roles.ta;
  }
}
</script>
