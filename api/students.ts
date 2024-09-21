import { get, post, put, del } from '../shared/requests';

const getStudents = async () => {
  return await get('/students/');
};

const updateStudent = async (studentId: string, student: Student) => {
  return await put(`/students/${studentId}`, student);
};

const updateStudentKeycode = async (studentId: string, keycode: string) => {
  return await put(`/students/keycode/${studentId}`, { keycode });
};

const postStudent = async (student: Student) => {
  return await post('/students/', student);
};

const deleteStudent = async (studentId: string) => {
  return await del(`/students/${studentId}`);
};

const deleteAllStudents = async () => {
  return await del('/students/all');
};

const checkKeycode = async (keycode: string) => {
  return await get(`/students/${keycode}`);
};

export default {
  getStudents,
  updateStudent,
  updateStudentKeycode,
  postStudent,
  deleteStudent,
  deleteAllStudents,
  checkKeycode,
};
