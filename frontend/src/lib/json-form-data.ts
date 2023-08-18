// Source https://github.com/hyperatom/json-form-data/blob/fd7aee85de913ffed4702ffb23dedda4921026cd/src/jsonToFormData.js

function isArray(val: any): val is Array<any> {
  const toString = {}.toString;
  return toString.call(val) === '[object Array]';
}

function isObject(val: any): val is Record<string, any> {
  return !isArray(val) && typeof val === 'object' && !!val;
}

function convert(
  jsonObject: Record<string, any>,
  parentKey?: string,
  carryFormData?: FormData
): FormData {
  const formData = carryFormData || new FormData();

  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      const value = jsonObject[key];
      if (value !== null && value !== undefined) {
        let propName = parentKey || key;

        if (parentKey && isObject(jsonObject)) {
          propName = `${parentKey}[${key}]`;
        }

        if (parentKey && isArray(jsonObject)) {
          propName = `${parentKey}[]`;
        }

        if (value instanceof File) {
          formData.append(propName, value);
        } else if (value instanceof FileList) {
          for (let j = 0; j < jsonObject[key].length; j++) {
            const file = jsonObject[key].item(j);
            if (file) {
              formData.append(propName + '[]', file);
            }
          }
        } else if (isArray(value) || isObject(value)) {
          convert(value, propName, formData);
        } else if (typeof value === 'boolean') {
          formData.append(propName, value ? 'true' : 'false');
        } else if (typeof value !== 'symbol' && typeof value !== 'function') {
          formData.append(propName, String(value));
        }
      }
    }
  }

  return formData;
}

export default convert;
