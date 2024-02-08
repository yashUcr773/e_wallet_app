import { Outlet, Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { isSignedInAtom, } from '../store/atoms/user'

export const CheckLoginStatus = () => {
    const isSignedIn = useRecoilValue(isSignedInAtom)

    return <div>
        {isSignedIn ? <Navigate to="/dashboard" /> : <Outlet />}
    </div>

}