// generate hash from string
const hasher = (val) => {
    return require("crypto")
        .createHash("sha256")
        .update(val, "utf8")
        .digest("hex");
};

const getRandomBalance = (low, high) => {
    return Math.floor(Math.random() * (high - low + 1)) + low;
};

module.exports = {
    hasher,
    getRandomBalance,
};
