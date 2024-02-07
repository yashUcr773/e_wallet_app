import React from 'react'
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { isSignedInAtom, userAtom } from '../store/atoms/user';

export function Header() {

    const navigate = useNavigate()
    const isSignedIn = useRecoilValue(isSignedInAtom)
    const user = useRecoilValue(userAtom)

    return <header className='flex items-center justify-between px-8 w-full h-20'>
        <span className='font-bold text-3xl p-2 cursor-pointer' onClick={() => { navigate('/dashboard') }}>Payments App</span>
        {!isSignedIn ?
            <div className='login-container flex flex-row gap-4'>
                <button className="border border-black p-2 px-4 rounded-lg" onClick={() => navigate('/signin')}>Login</button>
                <button className="border border-black p-2 px-4 rounded-lg bg-black text-white" onClick={() => navigate('/signup')}>Signup</button>
            </div> :
            <div className='user-info-container flex flex-row items-center justify-center gap-4'>
                <span className='font-bold text-xl'>
                    Hello, {user.firstname}
                </span>
                <div className='flex profile-circle border border-slate-500 bg-slate-400 rounded-full p-2 w-12 h-12 items-center justify-center'>
                    <span className='font-bold text-xl'>{user.firstname[0]}</span>
                </div>
            </div>
        }
    </header>
}