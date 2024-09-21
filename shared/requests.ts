import Store from './store';
import { baseURL } from '../utils/config';

export type StandardResponse = {
  status: number;
  data?: any;
  error?: any;
  success: boolean;
};

const standardResponse = async (reqPromise: Promise<Response>) => {
  try {
    const req = await reqPromise;

    if (req.status === 200) {
      const data = await req.json();

      return {
        data,
        status: req.status,
        success: true,
      } as StandardResponse;
    }
    if (req.status === 204) {
      return {
        status: req.status,
        success: true,
      } as StandardResponse;
    }
    const error = await req.json();

    return {
      error: new Error(error.message ?? ''),
      status: req.status,
      success: false,
    } as StandardResponse;
  } catch (err) {
    console.error(err);

    return {
      error: new Error('Unable to process request'),
      status: -1,
      success: false,
    } as StandardResponse;
  }
};

const authentication = ():
  | { authorization: string }
  | Record<string, never> => {
  const authToken: string = Store.get('access-token') ?? '';

  if (authToken) {
    return { authorization: `Bearer ${authToken}` };
  }
  return {};
};

export const get = async (path: string) =>
  standardResponse(
    fetch(`${baseURL}${path}`, {
      mode: 'cors',
      headers: {
        accept: 'application/json',
        ...authentication(),
      },
    }),
  );

export const post = async (path: string, data: any) =>
  standardResponse(
    fetch(`${baseURL}${path}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...authentication(),
      },
      body: JSON.stringify(data),
    }),
  );

export const postFile = async (presignedUrl: string, form: FormData) =>
  standardResponse(
    fetch(`${presignedUrl}`, {
      method: 'POST',
      mode: 'cors',
      body: form,
    }),
  );

export const put = async (path: string, data: any) =>
  standardResponse(
    fetch(`${baseURL}${path}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...authentication(),
      },
      body: JSON.stringify(data),
    }),
  );

export const del = async (path: string, data?: any) =>
  standardResponse(
    fetch(`${baseURL}${path}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...authentication(),
      },
      body: JSON.stringify(data),
    }),
  );
