
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