import { post, postFile } from '@/shared/requests';

async function getPresignedUrl(
  id: string,
  file: {
    keyPrefix: string;
    contentType: string;
    filename: string;
    mimetype: string;
  },
) {
  return await post(`/presignedUrl/${id}`, file);
}

async function uploadFile(
  presignedUrl: string,
  presignedFields: any,
  file: File,
  mimetype?: string,
) {
  const form = new FormData();
  if (file.type != '') {
    form.append('Content-Type', file.type);
  } else if (mimetype && mimetype != '') {
    form.append('Content-Type', mimetype);
  }

  form.append('Content-Disposition', 'attachment');

  Object.keys(presignedFields).forEach((key) =>
    form.append(key, presignedFields[key]),
  );
  form.append('file', file);

  return await postFile(presignedUrl, form);
}

export default {
  getPresignedUrl,
  uploadFile,
};
