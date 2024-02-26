import React, { useEffect, useState } from 'react'
import { useRecoilState, } from 'recoil'
import { balanceAtom, } from '../store/atoms/user'
import { CONSTANTS } from '../../config/CONSTANTS'
import { Loader } from './Loader'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'

export function Balance() {

    const [balance, setBalance] = useRecoilState(balanceAtom)
    const [networkCallStatus, setNetworkCallStatus] = useState(false)
    const customAxiosPrivate = useAxiosPrivate()

    useEffect(() => {
        updateBalance()
    }, [])

    async function updateBalance() {
        try {
            setNetworkCallStatus(true)
            let response = await customAxiosPrivate(CONSTANTS.ACCOUNT.GET_MY_BALANCE)
            setBalance(response.data.balance)
        } catch (e) {
            console.log(e)
        } finally {
            setNetworkCallStatus(false)
        }
    }

    return <>
        {networkCallStatus ?
            <div className='flex flex-row items-center justify-center w-full'>
                <Loader size='md'></Loader>
            </div> :
            <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Your Balance: <span>{balance}</span>
            </h3>
        }
    </>
}