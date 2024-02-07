import { atom } from "recoil";

export const isSignedInAtom = atom({
    key: "isSignedInAtom",
    default: false,
});

export const userAtom = atom({
    key: "userAtom",
    default: {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@gmail.com",
        userId: "XXXXXXXXXXXX",
    },
});

export const balanceAtom = atom({
    key: "balanceAtom",
    default: 0,
});
