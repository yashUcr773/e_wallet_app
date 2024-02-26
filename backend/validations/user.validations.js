// imports
const zod = require("zod");
const passwordSchema = zod
    .string()
    .min(8)
    .max(24)
    .refine(
        (value) => {
            const hasLowerCase = /[a-z]/.test(value);
            const hasUpperCase = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                value
            );
            return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
        },
        {
            message:
                "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        }
    );

// define schemas
const USER_SIGNUP_VALIDATOR = zod.object({
    firstname: zod.string().min(3),
    lastname: zod.string().min(3),
    email: zod.string().email(),
    password: passwordSchema,
});

const USER_SIGNIN_VALIDATOR = zod.object({
    email: zod.string().email(),
    password: zod.string(),
});

const USER_UPDATE_VALIDATOR = zod.object({
    password: passwordSchema.optional().or(zod.literal("")),
    firstName: zod.string().optional().or(zod.literal("")),
    lastName: zod.string().optional().or(zod.literal("")),
});

module.exports = {
    USER_UPDATE_VALIDATOR,
    USER_SIGNIN_VALIDATOR,
    USER_SIGNUP_VALIDATOR,
};
