import { get, post, put } from '../shared/requests';

async function getReturns() {
  return await get('/returns/');
}

async function getReturnByID(id: string) {
  return await get(`/returns/${id}`);
}

async function getAllReturns() {
  return await get('/returns/all');
}

async function returnOrder(id: string, approve: boolean) {
  return await put(`/returns/${id}?approved=${approve}`, {});
}

async function requestReturn(opartId: string, quantityToReturn: number) {
  return await post(`/returns/${opartId}`, {
    quantityToReturn,
  });
}

async function checkReturnBelongs(id: string, keycode: string) {
  return await post(`/returns/check/${id}`, {
    keycode,
  });
}

export default {
  getReturns,
  getReturnByID,
  returnOrder,
  getAllReturns,
  checkReturnBelongs,
  requestReturn,
};
