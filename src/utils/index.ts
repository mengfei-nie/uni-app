export const generateUrl = (path: string, query: { [propName: string]: string }): string =>
  Object.keys(query).reduce((acc, cur) => { acc += `${cur}=${query[cur]}&`; return acc }, `${path}?`)

