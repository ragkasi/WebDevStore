import { get, post, put, del } from '../shared/requests';

async function getVendors() {
  return await get('/vendors');
}

async function postVendor(name: string) {
  const data = {
    name: name,
  };

  return await post(`/vendors/create`, data);
}

async function editVendor(id: string, name: string) {
  const data = {
    name: name,
  };
  return await put(`/vendors/edit/${id}`, data);
}

async function deleteVendor(id: string) {
  return await del(`/vendors/delete/${id}`);
}

export default {
  getVendors,
  postVendor,
  editVendor,
  deleteVendor,
};
