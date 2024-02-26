import { useSetRecoilState } from "recoil";
import { accessTokenAtom, userAtom } from "../store/atoms/user";

export function useSetCurrentSession() {

    const setUser = useSetRecoilState(userAtom)
    const setAccessToken = useSetRecoilState(accessTokenAtom)

    function setCurrentSession({ accessToken, userData }) {
        if (accessToken != undefined && accessToken != null) {
            setAccessToken(accessToken)
        }
        if (userData != undefined && userData != null) {
            setUser(userData)
        }

    }
    return setCurrentSession

}