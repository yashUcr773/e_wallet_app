import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { balanceAtom, userAtom } from '../store/atoms/user'
import axios from 'axios'
import { CONSTANTS } from '../../config/CONSTANTS'

export function Balance() {

    const user = useRecoilValue(userAtom)
    const [balance, setBalance] = useRecoilState(balanceAtom)

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
    }

    return <>
        <span className='pb-4 font-bold text-xl'>Your Balance: <span>{balance}</span></span>
    </>
}