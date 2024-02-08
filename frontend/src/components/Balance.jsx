import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { balanceAtom, userAtom } from '../store/atoms/user'
import axios from 'axios'
import { CONSTANTS } from '../../config/CONSTANTS'
import { Loader } from './Loader'

export function Balance() {

    const user = useRecoilValue(userAtom)
    const [balance, setBalance] = useRecoilState(balanceAtom)
    const [networkCallStatus, setNetworkCallStatus] = useState(false)

    useEffect(() => {
        updateBalance()
    }, [])

    async function updateBalance() {
        try {

            let response = await axios.get(CONSTANTS.APIBASEURL + '/account/balance', {
                headers: {
                    'authorization': localStorage.getItem('token'),
                }
            })

            setBalance(response.data.balance)
        } catch (e) {
            console.log(e)
        }
        setNetworkCallStatus(true)
    }

    return <>
        {networkCallStatus ?
            <span className='pb-4 font-bold text-xl'>Your Balance: <span>{balance}</span></span> :
            <Loader></Loader>
        }
    </>
}