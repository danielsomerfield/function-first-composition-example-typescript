export const quietLogs = () => {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
};

export const sortByField = <T>(t: T[], field: keyof T) => {
  return t.sort((t1, t2) => {
    return t1[field] > t2[field] ? 1 : -1;
  });
};

export const sortByValue = <T>(t: T[], fieldFetch: (t: T) => any) => {
  return t.sort((t1, t2) => {
    return fieldFetch(t1) > fieldFetch(t2) ? 1 : -1;
  });
};
