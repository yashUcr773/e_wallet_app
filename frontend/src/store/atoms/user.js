import { atom } from "recoil";

export const isSignedInAtom = atom({
    key: "isSignedInAtom",
    default: false,
});

export const userAtom = atom({
    key: "userAtom",
    default: null,
});

export const balanceAtom = atom({
    key: "balanceAtom",
    default: 0,
});

export const accessTokenAtom = atom({
    key: "accessTokenAtom",
    default: null,
});
