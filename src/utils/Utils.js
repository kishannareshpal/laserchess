
/**
 * Check if a string is all lowercase
 * 
 * @param {string} str the string to check
 * @returns true if the str is all lowercase, otherwise false.
 */
export const isLowerCase = (str) => {
    if (!str) {
        return false;
    }
    return str === str.toLowerCase();
};



/**
 * Swap two items of an array, with each other.
 * 
 * @param {Array} arr the array you want to perform the swap opperation on
 * @param {Number} indexA the index of first item, to be swapped with the second item.
 * @param {Number} indexB the index of the second item, to be swapped with the first item.
 * 
 * @returns {Array} the array with swapped items.
 */
export const swapArrayItems = (arr, indexA, indexB) => {
    let temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
    return arr;
};