import { get, post, put } from '../shared/requests';

async function getLoans() {
  return await get('/loans');
}

async function getOverdueLoans(teamName: string) {
  return await get(`/loans/overdue/${teamName}`);
}

async function getPastLoans() {
  return await get('/loans/past');
}

async function getCurrentLoans() {
  return await get('/loans/current');
}

async function getLostLoans() {
  return await get('/loans/lost');
}

async function getLoansByKeycode(keycode: string) {
  return await get(`/loans/${keycode}`);
}

async function checkOut(
  name: string,
  isTool: boolean,
  description: string,
  keycode: string,
) {
  const data = {
    name: name,
    isTool: isTool,
    description: description,
    keycode: keycode,
  };
  return await post(`/loans/checkout`, data);
}

async function checkIn(ids: string[]) {
  return await put(`/loans/checkin/${btoa(JSON.stringify(ids))}`, {});
}

const renewLoans = async (ids: string[]) => {
  return await put(`/loans/renew/${btoa(JSON.stringify(ids))}`, {});
};

async function reportLostLoan(id: string) {
  return await put(`/loans/lost/${id}`, {});
}

async function reportFoundLoan(id: string) {
  return await put(`/loans/found/${id}`, {});
}

export default {
  getLoans,
  getOverdueLoans,
  getPastLoans,
  getCurrentLoans,
  getLostLoans,
  getLoansByKeycode,
  checkOut,
  checkIn,
  renewLoans,
  reportLostLoan,
  reportFoundLoan,
};
