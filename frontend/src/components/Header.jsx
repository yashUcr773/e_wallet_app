import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from 'recoil';
import { isSignedInAtom, userAtom } from '../store/atoms/user';
import { ProfileLogo } from './ProfileLogo'

export function Header() {

    const navigate = useNavigate()
    const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInAtom)
    const [user, setUser] = useRecoilState(userAtom)
    const [showModal, setShowModal] = useState(false)

    function logout() {
        localStorage.removeItem('token')
        setIsSignedIn(false)
        setUser({})
        setShowModal(false)
        navigate('/signin')
    }

    return <header className='flex items-center justify-between px-8 w-full h-20 gap-8'>
        <span className='font-bold text-xl sm:text-2xl p-2 cursor-pointer' onClick={() => { navigate('/dashboard') }}>Payments App</span>
        {!isSignedIn ?
            <div className='login-container flex flex-row gap-4 select-none'>
                <button className="border border-black p-2 px-4 rounded-lg" onClick={() => navigate('/signin')}>Login</button>
                <button className="border border-black p-2 px-4 rounded-lg bg-black text-white" onClick={() => navigate('/signup')}>Signup</button>
            </div> :
            <div className='user-info-container flex flex-row items-center justify-center gap-2 sm:gap-4 relative'>
                <span className='font-bold text-xl'>
                    Hello, {user.firstname}
                </span>
                <div id="dropdownDefaultButton" data-dropdown-toggle="dropdown" onClick={() => { setShowModal(p => !p) }} >
                    <ProfileLogo content={user.firstname[0]} />
                </div>
                <div id="dropdown" className={`z-10 ${showModal ? '' : 'hidden'} bg-gray-900 divide-y divide-white rounded-lg shadow w-44  absolute -bottom-[75%] translate-y-[75%] select-none`}>
                    <ul className={`py-2 text-sm text-white`} aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a className="block px-4 py-2">Logged in as <span>{user.email}</span></a>
                        </li>

                    </ul>
                    <ul className={`py-2 text-sm text-white`} aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a onClick={logout} className="block px-4 py-2 hover:bg-gray-700 cursor-pointer">Logout</a>
                        </li>

                    </ul>
                </div>
            </div>
        }
    </header>
}