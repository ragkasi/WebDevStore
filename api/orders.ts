import { del, get, post, put } from '../shared/requests';

const getOrders = async () => {
  return await get('/orders/');
};

const getOrdersByTeam = async (teamId: string) => {
  return await get(`/orders/team/${teamId}`);
};

const getOrderByID = async (id: string) => {
  return await get(`/orders/${id}/`);
};

const postOrder = async (
  products:
    | { type: 1; data: { weight: number } }
    | { type: 0; data: { quantity: number } },
  parts: {
    name: string;
    partKey: string;
    quantityOrdered: number;
  },
) => {
  return await post('/orders/', { products, parts });
};

const approveOrder = async (id: string, approved: boolean) => {
  return await put(`/orders/approve/${id}`, { approved });
};

const approveAllOrders = async (teamName: string) => {
  return await put('/orders/approve/all', {
    teamName: teamName,
  });
};

const updateOrder = async (id: string, newOrder: Order) => {
  return await put(`/orders/${id}`, { newOrder });
};

const checkOrderBelongs = async (id: string, keycode: string) => {
  return await post(`/orders/check/${id}`, { keycode });
};

const getAllOrders = async () => {
  return await get('/orders/all/');
};

const deleteOrder = async (id: string) => {
  return await del(`/orders/${id}`);
};

const deleteOldOrder = async (date: Date) => {
  return await del(`/orders/createdAt`,{ date });
};

export default {
  getOrders,
  getOrdersByTeam,
  approveOrder,
  approveAllOrders,
  updateOrder,
  getOrderByID,
  checkOrderBelongs,
  postOrder,
  getAllOrders,
  deleteOrder,
  deleteOldOrder
};
