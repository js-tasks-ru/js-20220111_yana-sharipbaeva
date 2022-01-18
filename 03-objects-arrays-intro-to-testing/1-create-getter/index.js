/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (product){
    let result = {...product};
    path.split('.').map(item => result && result[item] ? result = result[item] : result = undefined);
    return result;
  };
}
