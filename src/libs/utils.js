export const uid = () => Math.random().toString(36).substring(2)
export const is_object = (val, or = false) => typeof val === 'object' && val !== null && !Array.isArray(val) ? val : or
export const is_array = (val, or = false) => typeof val === 'object' && Array.isArray(val) ? val : or
export const in_array = (item, arr, or = false) => is_array(arr) && arr.indexOf(item) != -1 ? true : or
export const is_string = (val, or = false) => typeof val === 'string' ? true : or
export const is_number = (val, or = false) => typeof val === 'number' ? true : or
export const is_callback = (val, or = false) => typeof val === 'function' ? val : or
export const is_callable = (val, or = false) => typeof val === 'function' ? val : or
export const is_define = (val, or = false) => typeof val !== 'undefined' ? val : or
export const is_null = (val, or = false) => val === null ? true : or



