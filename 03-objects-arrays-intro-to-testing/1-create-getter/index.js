/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const splitedPath = path.split('.');
  return function (product){
    let productCopy = {...product};
    let result;
    splitedPath.forEach(item => {
      if (path && productCopy){
        productCopy = productCopy[item];
        result = productCopy;
      }
    });
    return result;
  };
}
