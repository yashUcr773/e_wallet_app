import axios from 'axios';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { CONSTANTS } from '../../config/CONSTANTS';
import { Loader } from './Loader'
import { ProfileLogo } from './ProfileLogo'

export function SendMoney() {
    const location = useLocation();
    const user = location.state;
    const [amount, setAmount] = useState("")
    const [showLoader, setShowLoader] = useState(false)
    const [networkFeedback, setNetworkFeedback] = useState("")
    const [transferSuccess, setTransferSuccess] = useState(false)

    async function initiateTransfer() {

        if (!amount || amount == 0 || amount == "") {
            setAmount("")
            setNetworkFeedback('Enter valid amount')
            setTransferSuccess(false)
            return
        }
        const to = user._id
        try {

            setShowLoader(true)
            let response = await axios.post(CONSTANTS.APIBASEURL + '/account/transfer', {
                to, amount
            }, { headers: { authorization: localStorage.getItem('token') } })

            setShowLoader(false)
            setAmount("")
            setNetworkFeedback(response.data.message)
            setTransferSuccess(true)
        } catch (e) {
            setNetworkFeedback(e.response.data.message)
            setTransferSuccess(false)
            setShowLoader(false)
        }
        setShowLoader(false)
    }

    return <div className='send-money-container flex shadow-lg flex-col items-center justify-center  rounded-lg p-8 w-[400px] bg-white'>
        <span className='font-bold text-2xl'>Send Money</span>
        <div className='flex flex-row items-center justify-start w-full gap-4 mt-20'>

            <ProfileLogo content={user.firstname[0]} />
            <span className='font-bold text-lg'>{user.firstname} {user.lastname}</span>
        </div>
        <div className='w-full flex flex-col m-4'>
            <span className='font-semibold pb-2'>Amount ($)</span>
            <input value={amount} className='border border-slate-400 bg-gray-50 p-4 py-2 font-semibold' placeholder='Enter amount' onChange={(e) => setAmount(+e.target.value)}></input>
        </div>
        <button className='w-full bg-green-500 border border-b-green-500 rounded-lg p-2 text-white flex flex-row items-center justify-center h-16 gap-4' onClick={() => initiateTransfer()}>Initiate Transfer {showLoader ? <Loader></Loader> : null}</button>
        <span className={`network-feedback mt-4 font-bold text-xl ${transferSuccess ? 'text-green-600' : 'text-red-500'}`}>{networkFeedback}</span>
    </div>

}