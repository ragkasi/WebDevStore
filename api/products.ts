import { get, post } from '../shared/requests';

async function postProduct(id: string, product: Product) {
  return await post(`/products/${id}`, product);
}

async function getFiles(id: string) {
  return await get(`/products/files/${id}`);
}

export default {
  postProduct,
  getFiles,
};
