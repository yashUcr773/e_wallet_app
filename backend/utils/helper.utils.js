// generate hash from string
const getRandomBalance = (low, high) => {
    return Math.floor(Math.random() * (high - low + 1)) + low;
};

module.exports = {
    getRandomBalance,
};
