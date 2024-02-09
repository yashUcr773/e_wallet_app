// imports
const zod = require("zod");

// define schemas
const USERSIGNUP = zod.object({
    firstname: zod.string().min(3),
    lastname: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(4).max(32),
});

const USERSIGNIN = zod.object({
    email: zod.string().email(),
    password: zod.string().min(4).max(32),
});

const USERUPDATE = zod.object({
    password: zod.string().min(4).max(32).optional().or(zod.literal("")),
    firstName: zod.string().optional().or(zod.literal("")),
    lastName: zod.string().optional().or(zod.literal("")),
});

module.exports = {
    USERUPDATE,
    USERSIGNIN,
    USERSIGNUP,
};
