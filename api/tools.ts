import { get, post, put, del, postFile } from '../shared/requests';

function convertFileToJSON(file: File | null) {
  return file
    ? {
        filename: file.name,
        mimetype: file.type,
      }
    : null;
}

async function getTools() {
  return await get('/tools');
}

async function getCommonTools() {
  return await get('/tools/common');
}

async function getTool(id: string) {
  return await get(`/tools/${id}`);
}

async function postTool(
  name: string,
  toolKey: string,
  quantity: number,
  requireItemNumber: boolean,
  allowMultipleLoans: boolean,
  isCommon: boolean,
  previewFile: null | File,
) {
  const data = {
    name: name,
    toolKey: toolKey,
    quantity: quantity,
    requireItemNumber: requireItemNumber,
    allowMultipleLoans: allowMultipleLoans,
    isCommon: isCommon,
    file: convertFileToJSON(previewFile),
  };

  return await post(`/tools/create`, data);
}

async function editTool(
  id: string,
  name: string,
  toolKey: string,
  quantity: number,
  requireItemNumber: boolean,
  allowMultipleLoans: boolean,
  isCommon: boolean,
  previewFile: null | File,
) {
  const data = {
    name: name,
    toolKey: toolKey,
    quantity: quantity,
    requireItemNumber: requireItemNumber,
    allowMultipleLoans: allowMultipleLoans,
    isCommon: isCommon,
    file: convertFileToJSON(previewFile),
  };

  return await put(`/tools/edit/${id}`, data);
}

async function deleteTool(id: string) {
  return await del(`/tools/delete/${id}`);
}

export default {
  getTool,
  getCommonTools,
  getTools,
  editTool,
  postTool,
  deleteTool,
};
