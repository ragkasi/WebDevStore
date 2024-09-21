import { get, post, put, del } from '../shared/requests';

// #region types
declare type SuggestedChargePost = {
  description: string;
  amount: number;
};

declare type ChargePost = {
  teamId: string;
  description: string;
  amount: number;
};
// #endregion

// #region charges
const getAllCharges = async () => {
  return await get('/charges/');
};

const getAllChargesByTeamId = async (teamId: string) => {
  return await get(`/charges/${teamId}`);
};

const putCharge = async (chargeId: string, charge: ChargePost) => {
  return await put(`/charges/${chargeId}`, charge);
};

const postCharge = async (charge: ChargePost) => {
  return await post('/charges/', charge);
};

const deleteCharge = async (chargeId: string) => {
  return await del(`/charges/${chargeId}`);
};
// #endregion

// #region suggested charges
const getSuggestedCharges = async () => {
  return await get('/charges/suggested');
};

const putSuggestedCharge = async (
  suggestedChargeId: string,
  suggestedCharge: SuggestedChargePost,
) => {
  return await put(`/charges/suggested/${suggestedChargeId}`, suggestedCharge);
};

const postSuggestedCharge = async (suggestedCharge: SuggestedChargePost) => {
  return await post('/charges/suggested/', suggestedCharge);
};

const deleteSuggestedCharge = async (suggestedChargeId: string) => {
  return await del(`/charges/suggested/${suggestedChargeId}`);
};
// #endregion

export default {
  //charges
  getAllCharges,
  getAllChargesByTeamId,
  postCharge,
  putCharge,
  deleteCharge,
  //suggested charges
  getSuggestedCharges,
  putSuggestedCharge,
  postSuggestedCharge,
  deleteSuggestedCharge,
};
