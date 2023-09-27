export const extractQueryParmeters = (link: string) => {
  const queryObject: any = {};
  const questionMarkIndex = link.indexOf('?');
  if (questionMarkIndex !== -1 && questionMarkIndex + 2 < link.length) {
    const queryString: string = link.substring(questionMarkIndex + 1);
    const queryArray: string[] = queryString.split('&');
    for (let i = 0; i < queryArray.length; i++) {
      queryObject[queryArray[i].substring(0, queryArray[i].indexOf('='))] =
        queryArray[i].substring(queryArray[i].indexOf('=') + 1);
    }
  }
  return queryObject;
};
