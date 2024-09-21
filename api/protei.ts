import { get, post, put, del } from '../shared/requests';

const getProtei = async () => {
  return await get('/protei/');
};

const getProteus = async (proteusNum: string) => {
  return await get(`/protei/${proteusNum}`);
};

const postProteus = async (proteus: Proteus) => {
  return await post('/protei', proteus);
};

const postProteusUpdate = async (
  update: ProteusUpdate,
  issue: { issuePrompts: string[]; lastStudentAction: string } | null,
) => {
  return await post(`/protei/${update.id}/updates`, { ...update, issue });
};

const putIssue = async (issue: {
  id: string;
  resolved: boolean;
  issueTypes: string[];
}) => {
  return await put(`/protei/issues/${issue.id}`, issue);
};

const getIssue = async (id: string) => {
  return await get(`/protei/issues/${id}`);
};

const putProteus = async (proteus: { id: string; note: string }) => {
  return await put(`/protei/${proteus.id}`, proteus);
};

const deleteProteus = async (proteus: Proteus) => {
  return await del(`/protei/${proteus.id}`);
};

export default {
  getProtei,
  getProteus,
  postProteus,
  postProteusUpdate,
  putIssue,
  putProteus,
  getIssue,
  deleteProteus,
};
