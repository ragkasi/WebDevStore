import { get, post, put, del, postFile } from '../shared/requests';

function convertFileToJSON(file: File | null) {
  return file
    ? {
        filename: file.name,
        mimetype: file.type != '' ? file.type : 'application/octet-stream',
      }
    : null;
}

async function getParts() {
  return await get('/parts');
}

async function getPart(id: string) {
  return await get(`/parts/${id}`);
}

async function postPart(
  name: string,
  partKey: string,
  price: number,
  quantity: number,
  reorderThreshold: number,
  category: string,
  vendor: string,
  canPurchase: boolean,
  canReturn: boolean,
  file: null | File,
  previewFile: null | File,
) {
  const data = {
    name: name,
    partKey: partKey,
    price: price,
    quantity: quantity,
    reorderThreshold: reorderThreshold,
    category: category,
    vendor: vendor,
    canPurchase: canPurchase,
    canReturn: canReturn,
    file0: convertFileToJSON(previewFile),
    file1: convertFileToJSON(file),
  };

  return await post(`/parts/create`, data);
}

async function editPart(
  id: string,
  name: string,
  partKey: string,
  price: number,
  quantity: number,
  reorderThreshold: number,
  category: string,
  vendor: string,
  canPurchase: boolean,
  canReturn: boolean,
  file: null | File,
  previewFile: null | File,
) {
  const data = {
    name: name,
    partKey: partKey,
    price: price,
    quantity: quantity,
    reorderThreshold: reorderThreshold,
    category: category,
    vendor: vendor,
    canPurchase: canPurchase,
    canReturn: canReturn,
    file0: convertFileToJSON(previewFile),
    file1: convertFileToJSON(file),
  };
  return await put(`/parts/edit/${id}`, data);
}

async function deletePart(id: string) {
  return await del(`/parts/delete/${id}`);
}

export default {
  getPart,
  getParts,
  editPart,
  postPart,
  deletePart,
};
