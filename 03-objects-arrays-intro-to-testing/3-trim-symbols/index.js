/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const arrayOfStr = [...string.split('')];
  let splitedArray = []
  arrayOfStr.forEach((item, index) => {
    if (item !== [...arrayOfStr][index - 1] && index !== 0 ){
      splitedArray = [...splitedArray, ';']
    }
    return splitedArray = [...splitedArray, item];
  });
  return splitedArray.join('').split(';').map(item => item.slice(0, size)).join('');
}
