import axios from 'axios';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { CONSTANTS } from '../../config/CONSTANTS';

export function SendMoney() {
    const location = useLocation();
    const user = location.state;
    const [amount, setAmount] = useState(0)

    async function initiateTransfer() {
        const to = user._id
        try {

            let response = await axios.post(CONSTANTS.APIBASEURL + '/account/transfer', {
                to, amount
            }, { headers: { authorization: localStorage.getItem('token') } })

        } catch (e) {
            setFormError(e.response.data.message)
        }

    }

    return <div className='send-money-container flex shadow-lg flex-col items-center justify-center  rounded-lg p-8 w-[400px] bg-white'>
        <span className='font-bold text-2xl'>Send Money</span>
        <div className='flex flex-row items-center justify-start w-full gap-4 mt-20'>
            <div className='flex profile-circle border border-slate-500 bg-slate-400 rounded-full p-2 w-12 h-12 items-center justify-center'>
                <span className='font-bold text-xl'>{user.firstname[0]}</span>
            </div>
            <span className='font-bold text-lg'>{user.firstname} {user.lastname}</span>
        </div>
        <div className='w-full flex flex-col m-4'>
            <span className='font-semibold pb-2'>Amount ($)</span>
            <input className='border border-slate-400 bg-gray-50 p-4 py-2 font-semibold' placeholder='Enter amount' onChange={(e) => setAmount(+e.target.value)}></input>
        </div>
        <button className='w-full bg-green-500 border border-b-green-500 rounded-lg p-2 text-white' onClick={() => initiateTransfer()}>Initiate Transfer</button>
    </div>

}