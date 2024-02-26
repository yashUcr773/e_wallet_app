import { CONSTANTS, customAxios } from "../../config/CONSTANTS";
import { useSetCurrentSession } from "./useSetCurrentSession";
import { useNavigate } from "react-router-dom";


export function useLogout() {

    const navigate = useNavigate();
    const setSession = useSetCurrentSession()

    async function logout({ toLink }) {
        try {
            await customAxios(CONSTANTS.AUTH.GET_LOGOUT, { withCredentials: true })

        } catch (e) {
            console.log(e)
        } finally {
            setSession({ accessToken: "", userData: null })
            if (toLink) {
                navigate(toLink)
            } else {
                navigate('/')
            }
        }
    }

    return logout

}