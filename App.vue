<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" class="bg-osu">
      <b-navbar-brand to="/"> FEH Robot Store </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" v-model="visible" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/parts">Parts</b-nav-item>
          <b-nav-item v-if="student" to="/services/add"> Services </b-nav-item>
          <b-nav-item to="/loans">Loans</b-nav-item>
          <b-nav-item v-if="admin || store" to="/orders/all">Orders</b-nav-item>
          <b-nav-item v-if="student" to="/orders/team">Orders</b-nav-item>
          <b-nav-item v-if="admin || proteusDeveloper || store" to="/protei"
            >Proteus</b-nav-item
          >
          <b-nav-item v-if="admin" to="/users">Users</b-nav-item>
          <b-nav-item v-if="admin" to="/sections">Sections</b-nav-item>
          <b-nav-item v-if="ta" to="/teams">Teams</b-nav-item>
          <b-nav-item v-if="teamName" :to="'/teams/' + teamName"
            >Team</b-nav-item
          >
          <b-nav-item v-if="admin || ta" to="/notes">Notes</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-text v-if="!visible">{{ this.userID }}</b-nav-text>
          <b-nav-item v-if="student" to="/orders/cart">
            <i class="fa fa-shopping-cart" />
            <span>&ensp;</span>
            <b-badge class="badge">{{ shoppingCartSize }}</b-badge> Cart
          </b-nav-item>
          <b-nav-item v-on:click="signOut"> Sign Out </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Server connection error! Please try again later.
    </b-alert>
    <b-toaster id="feh-toaster" name="feh-toaster" />
    <b-container class="content">
      <router-view />
    </b-container>
    <footer id="footer" class="footer text-center mt-3 p-2 bg-light">
      <span class="text-muted noselect">
        &copy; 2021 Fundamentals of Engineering for Honors Program,
        <a href="http://eed.osu.edu" style="color: #ce0f3d"
          >Department of Engineering Education</a
        >, The Ohio State University
      </span>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { reauthenticate, signOut, TOKENS } from './api/auth';
import roles from './shared/roles';
import { logFunMessagesToConsole } from './utils/fun';
import fun2 from './utils/fun2';

@Component({
  methods: {
    signOut,
  },
})
export default class App extends Vue {
  visible = false;

  showFailure = false;

  get userID() {
    return this.$store.state.auth.userID;
  }

  get shoppingCartSize() {
    let quant = 0;
    this.$store.state.cart.parts.forEach(
      (element: { quantityOrdered: number }) => {
        quant += Number(element.quantityOrdered);
      },
    );
    this.$store.state.cart.products.forEach(
      (element: { data: { quantity: number } }) => {
        quant += Number(element.data.quantity);
      },
    );
    return quant;
  }

  get admin() {
    return roles.admin;
  }

  get ta() {
    return roles.ta;
  }

  get proteusDeveloper() {
    return roles.proteusDeveloper;
  }

  get store() {
    return roles.store;
  }

  get student() {
    return roles.teamName;
  }

  get teamName() {
    return roles.teamName;
  }

  mounted() {
    if (!TOKENS.LOGGEDIN && window.location.pathname.indexOf('/auth') !== 0) {
      reauthenticate(this.$router.currentRoute.path);
    } else {
      logFunMessagesToConsole();
      fun2.render();
    }
  }
}
</script>

<style scoped>
.bg-osu {
  background-color: #ce0f3d !important;
  margin-bottom: 15px;
}

.badge {
  background-color: whitesmoke !important;
  color: black;
}

html {
  position: relative;
}

.footer {
  bottom: 0;
  position: fixed;
  width: 100%;
  z-index: 10000;
  background-color: #f5f5f5;
}

.content {
  height: 90%;
  margin-bottom: 5em;
}

.no-padding {
  padding-left: 0px;
  padding-right: 0px;
}

#feh-toaster {
  position: fixed;
  width: 400px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

<style>
.osu-link {
  color: #ce0f3d !important;
}
</style>
