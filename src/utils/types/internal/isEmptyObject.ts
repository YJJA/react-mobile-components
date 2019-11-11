/** val is empty object */
export const isEmptyObject = (obj: object) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};
