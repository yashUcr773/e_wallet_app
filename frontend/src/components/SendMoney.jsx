import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { CONSTANTS } from '../../config/CONSTANTS';
import { Loader } from './Loader'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';

export function SendMoney() {
    const location = useLocation();
    const user = location.state;
    const [amount, setAmount] = useState(0)
    const [showLoader, setShowLoader] = useState(false)
    const [networkFeedback, setNetworkFeedback] = useState("")
    const [transferSuccess, setTransferSuccess] = useState(true)
    const customAxios = useAxiosPrivate()

    async function initiateTransfer(e) {
        e.preventDefault()
        if (!amount || amount == 0 || amount == "") {
            setAmount("")
            setNetworkFeedback('Enter valid amount')
            setTransferSuccess(false)
            return
        }

        const to = user._id
        try {
            setShowLoader(true)
            let response = await customAxios.post(CONSTANTS.ACCOUNT.POST_TRANSFER, { to, amount })
            setShowLoader(false)
            setAmount("")
            setNetworkFeedback(response.data.message)
            setTransferSuccess(true)
        } catch (e) {
            console.log(e)
            setNetworkFeedback(e.response.data.message)
            setTransferSuccess(false)
            setShowLoader(false)
        }
        setShowLoader(false)
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-4 items-center justify-start mt-8 px-6 py-8 mx-auto lg:py-0 ">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-primary-500 border border-primary-500">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Send Money
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={initiateTransfer}>
                            <div>

                                <label htmlFor="amount"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    Amount ($)</label>
                                <input type="number" name="amount" id="amount"
                                    onChange={(e) => setAmount(+e.target.value)}
                                    value={amount}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="0" required />
                            </div>

                            <div className='name-container flex flex-row items-center gap-4'>
                                <div className="pointer-events-none relative w-14 h-14 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-16 h-16 text-gray-400 -left-1 top-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div className='flex flex-col'>

                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{user.firstname} {user.lastname}</h3>
                                    <span className="text-gray-500 dark:text-gray-400 truncate">{user.email}</span>
                                </div>
                            </div>

                            <p className={`rounded-lg w-full text-center text-sm font-normal ${transferSuccess ? 'text-green-600' : 'text-red-600'} whitespace-break-spaces`}>{networkFeedback}</p>

                            <button type="submit"
                                className="flex flex-row items-center justify-center gap-4 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Send Money {showLoader ? <Loader size={'sm'} /> : null}
                            </button>
                        </form>

                    </div>

                </div >
            </div >
        </section >
    )
}