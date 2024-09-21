import { get, post, put, del } from '../shared/requests';

const getNotes = async () => {
  return await get('/notes/');
};

const putNote = async (note: Note) => {
  return await put(`/notes/${note.id}`, note);
};

const postNote = async (note: Note) => {
  return await post('/notes/', note);
};

const deleteNote = async (note: Note) => {
  return await del(`/notes/${note.id}`);
};

export default {
  getNotes,
  putNote,
  postNote,
  deleteNote,
};
