const now = +new Date();
let index = 0;

export const uid = (prefix?: string) =>
  `${prefix ? prefix + '-' : ''}${now}-${++index}`;

export default uid;
