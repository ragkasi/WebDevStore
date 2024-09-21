import { get, post } from '../shared/requests';

const getTeapot = async () => {
  return await get('/teapot/');
};

const postTeapot = async (secretCode: number) => {
  return await post(`/teapot/${secretCode}`, {});
};

export default {
  getTeapot,
  postTeapot,
};
