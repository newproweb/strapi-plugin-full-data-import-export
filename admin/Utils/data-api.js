import { getFetchClient } from "@strapi/helper-plugin";

export const getMetadata = () => {
  const { get } = getFetchClient();

  return get(`/full-data-import-export/metadata`).then((d) => d.data);
};

export const generateData = () => {
  const { post } = getFetchClient();

  return post(`/full-data-import-export/generate`).then((d) => d.data);
};

export const downloadData = () => {
  const { get } = getFetchClient();

  return get(`/full-data-import-export/download`, { responseType: "blob" });
};

export const deleteData = () => {
  const { post } = getFetchClient();

  return post(`/full-data-import-export/delete`).then((res) => res.data);
};

export const uploadData = (formData) => {
  const { post } = getFetchClient();

  return post("/full-data-import-export/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data);
};
