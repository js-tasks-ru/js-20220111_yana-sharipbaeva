/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const reducer = (acc, item) => acc.includes(item) ? acc : [...acc, item];
  return arr ? [...arr].reduce(reducer, []) :  [];
}
