import { get, post, put, del } from '../shared/requests';

const getSections = async () => {
  return await get('/sections/');
};

const putSection = async (sectionId: string, section: Section) => {
  return await put(`/sections/${sectionId}`, section);
};

const postSection = async (section: Section) => {
  return await post('/sections/', section);
};

const deleteSection = async (sectionId: string) => {
  return await del(`/sections/${sectionId}`);
};

export default {
  getSections,
  putSection,
  postSection,
  deleteSection,
};
