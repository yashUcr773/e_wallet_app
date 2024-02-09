import { useEffect } from "react";

export const useEnterListener = (dependencies = [], functionToTrigger = undefined) => {

    if (dependencies.constructor !== Array || functionToTrigger == undefined) {
        throw new Error('Pass array or dependencies or function is undefined')
    }

    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault();
                functionToTrigger()
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, dependencies);
}
