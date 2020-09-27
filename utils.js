// making a function that gets a function as a parameter, returns another function after an specified amount of time
const debounce = (callback, delay) => {
    let timeoutId;
    return (...args) => {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback.apply(null, args);
        }, delay);
    }
};