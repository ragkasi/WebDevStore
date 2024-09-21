import { DEBUG } from '@/utils/config';
import { decode as decodeBase64 } from 'js-base64';
import Store from '../shared/store';

export class JsonWebToken {
  content: Record<string, unknown> = {};

  type: 'access' | 'id' = 'access';

  constructor(jwt?: string) {
    if (!jwt) return;

    try {
      this.content = JSON.parse(decodeBase64(jwt.split('.')[1]));
    } catch (err) {
      console.error(err);
    }

    if (this.content.token_use === 'id') {
      this.type = 'id';
    }
  }

  get isExpired() {
    const expiry = this.content.exp as number | undefined;
    if (!expiry) return true;
    if (new Date(expiry * 1000) > new Date()) return false;
    return true;
  }
}

export class AuthenticationError extends Error {
  type = 'auth';

  action: 'retry' | 'prompt' = 'prompt';

  additionalContext?: string;

  constructor(
    message: string,
    action?: 'retry' | 'prompt',
    additionalContext?: string,
  ) {
    super(message);

    if (action) {
      this.action = action;
    }

    if (additionalContext) {
      this.additionalContext = additionalContext;
    }
  }
}

export const extractHashCredentials = () => {
  const searchParams = new URLSearchParams(window.location.hash.substr(1));

  const accessToken = searchParams.get('access_token');
  const idToken = searchParams.get('id_token');

  if (accessToken && idToken) {
    Store.set('access-token', accessToken);
    Store.set('id-token', idToken);

    const accessJWT = new JsonWebToken(accessToken);
    const idJWT = new JsonWebToken(accessToken);

    if (accessJWT.isExpired || idJWT.isExpired) {
      throw new AuthenticationError('Your session timed out.', 'retry');
    }

    window.location.hash = '#';
  } else {
    Store.clearAll();
    throw new AuthenticationError(
      'Unable to successfully log you in.',
      'prompt',
      searchParams.get('error_description') ?? undefined,
    );
  }
};

export const reauthenticate = (path: string) => {
  Store.remove('access-token');
  Store.remove('id-token');

  Store.namespace('auth').set('postSignInPath', path);

  const meta = document.createElement('meta');
  meta.setAttribute('http-equiv', 'refresh');
  if (DEBUG) {
    meta.setAttribute(
      'content',
      `0; url=${process.env.VUE_APP_AUTH_REDIRECT_DEV ?? '#'}`,
    );
  } else {
    meta.setAttribute(
      'content',
      `0; url=${process.env.VUE_APP_AUTH_REDIRECT_PROD ?? '#'}`,
    );
  }
  document.head.appendChild(meta);

  document.body?.parentNode?.removeChild(document.body);

  if (DEBUG) {
    window.location.href = process.env.VUE_APP_AUTH_REDIRECT_DEV ?? '#';
  } else {
    window.location.href = process.env.VUE_APP_AUTH_REDIRECT_PROD ?? '#';
  }
};

export const signOut = () => {
  Store.clearAll();

  const meta = document.createElement('meta');
  meta.setAttribute('http-equiv', 'refresh');
  meta.setAttribute('content', '0; url=https://eed.osu.edu/');

  document.head.appendChild(meta);

  document.body.parentNode?.removeChild(document.body);
  window.location.href = 'https://eed.osu.edu/';
};

export const TOKENS = {
  get ACCESS() {
    return new JsonWebToken(Store.get('access-token'));
  },
  get ID() {
    return new JsonWebToken(Store.get('id-token'));
  },
  get LOGGEDIN() {
    return !(this.ACCESS.isExpired || this.ID.isExpired);
  },
};
