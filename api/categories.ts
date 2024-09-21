import { get, post, put, del } from '../shared/requests';

async function getCategories() {
  return await get('/categories');
}

async function postCategory(name: string) {
  const data = {
    name: name,
  };

  return await post(`/categories/create`, data);
}

async function editCategory(id: string, name: string) {
  const data = {
    name: name,
  };
  return await put(`/categories/edit/${id}`, data);
}

async function deleteCategory(id: string) {
  return await del(`/categories/delete/${id}`);
}

export default {
  getCategories,
  postCategory,
  editCategory,
  deleteCategory,
};
