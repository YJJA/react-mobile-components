/**
 * bindActionCreator
 */
interface IbindActionCreator {
  <D>(ac: () => any, dispatch: D): () => void;
  <D, T1>(ac: (t1: T1) => any, dispatch: D): (t1: T1) => void;
  <D, T1, T2>(ac: (t1: T1, t2: T2) => any, dispatch: D): (
    t1: T1,
    t2: T2
  ) => void;
  <D, T1, T2, T3>(ac: (t1: T1, t2: T2, t3?: T3) => any, dispatch: D): (
    t1: T1,
    t2: T2,
    t3?: T3
  ) => void;
  <D, T1, T2, T3>(ac: (t1: T1, t2: T2, t3: T3) => any, dispatch: D): (
    t1: T1,
    t2: T2,
    t3: T3
  ) => void;
}

export const bindActionCreator: IbindActionCreator = (
  actionCreator: any,
  dispatch: any
) => {
  return (...args: any[]) => {
    return dispatch(actionCreator(...args));
  };
};
