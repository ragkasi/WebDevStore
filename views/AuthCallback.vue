<template>
  <div class="container py-3">
    <h3>Signing in...</h3>

    <b-row>
      <b-col cols="12" md="8" order="2" order-md="1" class="mb-3">
        <hr />

        <b-alert :show="!!error" variant="danger">
          <b>There was an issue logging you in:</b>&nbsp;{{ error }}
          <template v-if="errorExtraContext">
            <hr />
            <i
              >Additional information for troubleshooting: "{{
                errorExtraContext.trim()
              }}"</i
            >
          </template>
        </b-alert>

        <b-skeleton-wrapper :loading="!error">
          <template #loading>
            <b-list-group>
              <b-list-group-item>
                <b-skeleton
                  width="45%"
                  height="2rem"
                  class="float-left"
                ></b-skeleton>
                <b-skeleton
                  type="button"
                  height="2rem"
                  class="float-right"
                ></b-skeleton>
              </b-list-group-item>
              <b-list-group-item>
                <b-skeleton
                  width="45%"
                  height="2rem"
                  class="float-left"
                ></b-skeleton>
                <b-skeleton
                  type="button"
                  height="2rem"
                  class="float-right"
                ></b-skeleton>
              </b-list-group-item>
              <b-list-group-item>
                <b-skeleton
                  width="45%"
                  height="2rem"
                  class="float-left"
                ></b-skeleton>
                <b-skeleton
                  type="button"
                  height="2rem"
                  class="float-right"
                ></b-skeleton>
              </b-list-group-item>
            </b-list-group>
          </template>
        </b-skeleton-wrapper>
      </b-col>
      <b-col cols="12" md="4" order="1" order-md="2" class="mb-3">
        <b-skeleton-wrapper :loading="!error">
          <template #loading>
            <b-card>
              <b-skeleton
                width="45%"
                height="2rem"
                class="float-left"
              ></b-skeleton>
              <b-skeleton
                width="45%"
                height="2rem"
                class="float-left"
              ></b-skeleton>

              <b-skeleton
                width="45%"
                height="2rem"
                class="float-left"
              ></b-skeleton>
              <b-skeleton type="button" height="2rem"></b-skeleton>
            </b-card>
          </template>
        </b-skeleton-wrapper>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  AuthenticationError,
  extractHashCredentials,
  reauthenticate,
} from '../api/auth';
import { get } from '../shared/requests';
import Store from '../shared/store';
import { storeRoles } from '../shared/roles';

@Component({})
export default class AuthCallback extends Vue {
  error = '';

  errorExtraContext = '';

  async mounted() {
    try {
      extractHashCredentials();
    } catch (error) {
      const err = error as AuthenticationError;
      console.error(err);

      if (err.type === 'auth') {
        this.$set(this, 'error', err.message);
        if (err.additionalContext)
          this.$set(this, 'errorExtraContext', err.additionalContext);

        if (err.action === 'retry') {
          setTimeout(
            () => reauthenticate(this.$router.currentRoute.path),
            3000,
          );
        }
      } else {
        this.$set(
          this,
          'error',
          'There was an issue logging you in. Try a different browser.',
        );
      }
    }

    if (!this.error) {
      const { data, success, error } = await get('/auth/role');

      if (success) {
        const priorRoute = Store.namespace('auth').get('postSignInPath');

        Store.namespace('auth').remove('postSignInPath');

        storeRoles(data);

        if (
          priorRoute &&
          priorRoute !== '/' &&
          priorRoute.indexOf('/auth') !== 0
        ) {
          this.$router.push(priorRoute).catch(() => {});
        } else {
          this.$router.push('/').catch(() => {});
        }

        this.$router.go(0);
        return;
      } else {
        console.error(error);
        this.$set(this, 'error', error.message);
        this.$set(
          this,
          'errorExtraContext',
          'Authentication role error prohibited sign in.',
        );

        this.$router.push('/forbidden').catch(() => {});
      }
    }
  }

  async redirect(to: string) {
    this.$bvModal.hide('admin-view');
    this.$router.push(to).catch(() => {});
  }
}
</script>
