// Source https://github.com/hyperatom/json-form-data/blob/fd7aee85de913ffed4702ffb23dedda4921026cd/src/jsonToFormData.js
/* eslint-disable capitalized-comments,guard-for-in,max-depth,no-implicit-coercion,no-multi-assign,no-multi-spaces,no-prototype-builtins,no-return-assign,no-undef,no-unused-vars,no-var,padded-blocks,prefer-arrow-callback,semi,space-before-function-paren,space-infix-ops,wrap-iife */

function isArray(val) {
  var toString = {}.toString;

  return toString.call(val) === '[object Array]';
}

function isObject(val) {
  return !isArray(val) && typeof val === 'object' && !!val;
}

function convert(jsonObject, parentKey, carryFormData) {
  var formData = carryFormData || new FormData();

  var index = 0;

  for (var key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
        var propName = parentKey || key;

        if (parentKey && isObject(jsonObject)) {
          propName = parentKey + '[' + key + ']';
        }

        if (parentKey && isArray(jsonObject)) {
          propName = parentKey + '[]';
        }

        if (jsonObject[key] instanceof File) {
          formData.append(propName, jsonObject[key]);
        } else if (jsonObject[key] instanceof FileList) {
          for (var j = 0; j < jsonObject[key].length; j++) {
            formData.append(propName + '[]', jsonObject[key].item(j));
          }
        } else if (isArray(jsonObject[key]) || isObject(jsonObject[key])) {
          convert(jsonObject[key], propName, formData);
        } else if (typeof jsonObject[key] === 'boolean') {
          formData.append(propName, +jsonObject[key] ? 'true' : 'false');
        } else if (
          typeof jsonObject[key] !== 'symbol' &&
          typeof jsonObject[key] !== 'function'
        ) {
          formData.append(propName, jsonObject[key]);
        }
      }
    }

    index++;
  }

  return formData;
}

export default convert;
