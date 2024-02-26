import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "../store/atoms/user";
import { Navigate, Outlet } from "react-router-dom";

export function IsLoggedInComponent() {
    const accessToken = useRecoilValue(accessTokenAtom)
    return accessToken ? <Navigate to="/" /> : <Outlet />
}