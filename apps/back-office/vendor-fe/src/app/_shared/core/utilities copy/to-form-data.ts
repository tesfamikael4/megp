export function toFormData(data: any): FormData {
  const formData = new FormData();

  for (const key in data) {
    if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
      for (const valueKey in data[key]) {
        formData.append(`${key}[${valueKey}]`, data[key][valueKey]);
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
