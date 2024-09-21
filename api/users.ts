import { get, post, put, del } from '../shared/requests';

const getUsers = async () => {
  return await get('/users/');
};

const putUser = async (userId: string, user: UserPost) => {
  return await put(`/users/${userId}`, user);
};

const postUser = async (user: UserPost) => {
  return await post('/users/', user);
};

const deleteUser = async (userId: string) => {
  return await del(`/users/${userId}`);
};

const deleteAllNonAdminUsers = async () => {
  return await del('/users/all');
};

export default {
  getUsers,
  putUser,
  postUser,
  deleteUser,
  deleteAllNonAdminUsers,
};
