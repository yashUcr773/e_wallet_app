import { Outlet, Navigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isSignedInAtom, userAtom } from '../store/atoms/user'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { CONSTANTS } from '../../config/CONSTANTS'
import { Loader } from './Loader'

export const CheckAuth = () => {
    const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInAtom)
    const setUser = useSetRecoilState(userAtom)
    const [networkCallStatus, setNetworkCallStatus] = useState(false)

    useEffect(() => {
        verifyToken()
    }, [])

    async function verifyToken() {

        try {

            let response = await axios.post(CONSTANTS.APIBASEURL + '/user/checkAuth', {
                token: localStorage.getItem('token')
            })

            localStorage.setItem('token', `Bearer ${response.data.token}`)
            setIsSignedIn(true)
            setUser({
                firstname: response.data.user.firstname, lastname: response.data.user.lastname, email: response.data.user.email, userId: response.data.user.userId
            })
        } catch (e) {
            setIsSignedIn(false)
            setUser({})
        }
        setNetworkCallStatus(true)
    }

    return (
        networkCallStatus ?
            isSignedIn ? <Outlet /> : <Navigate to="/signin" />
            : <Loader fullPage={true}></Loader>
    )
}