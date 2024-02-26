import React, { useEffect, useState } from 'react'
import { CONSTANTS } from '../../config/CONSTANTS'
import { useNavigate } from 'react-router-dom'
import { Loader } from './Loader'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'
import { useDebouncer } from '../hooks/useDebouncer'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../store/atoms/user'

export function SearchUsers() {
    const [filter, setFilter] = useState("")
    const [users, setUsers] = useState([])
    const [networkCallStatus, setNetworkCallStatus] = useState(false)
    const customAxios = useAxiosPrivate()
    const curruser = useRecoilValue(userAtom)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setNetworkCallStatus(true)
                let response = await customAxios(CONSTANTS.USER.GET_BY_FILTER(""))
                setUsers(response.data.users.filter((user) => user._id != curruser.userId))
            } catch (e) {
                console.log(e)
            } finally {
                setNetworkCallStatus(false)
            }
        }
        fetchUsers()
    }, [])

    const debouncedSearch = useDebouncer(async (search) => {
        let response = await customAxios(CONSTANTS.USER.GET_BY_FILTER(search))
        setUsers(response.data.users.filter((user) => user._id != curruser.userId))
    }, 300);

    function filterChangeHandler(e) {
        setFilter(e.target.value)
        debouncedSearch(e.target.value)
    }

    return <>
        <form className="flex items-center  mx-auto w-full relative align-middle justify-center" onSubmit={(e) => { e.preventDefault() }}>
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <input type="text" id="simple-search"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search users" required
                value={filter}
                onChange={filterChangeHandler}
            />
            <svg className="w-4 h-4 absolute top-3 right-2 pointer-events-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
        </form>

        {
            networkCallStatus ?
                <div className="flex flex-row justify-center items-center mt-8"><Loader></Loader></div> :
                <div className='users-container flex flex-col gap-8 mt-8'>
                    {users.map(user => { return <User key={user._id} user={user}></User> })}
                </div>
        }
    </>
}

export function User({ user }) {

    const navigate = useNavigate()

    function sendMoney() {
        navigate('/send', { state: user })
    }

    return <div className='user-container flex flex-row items-center justify-between gap-8'>
        <div className='name-container flex flex-row items-center gap-2 truncate'>
            <div className="pointer-events-none relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
            </div>
            <div className='truncate'>

                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{user.firstname} {user.lastname}</h3>
                <span className="text-gray-500 dark:text-gray-400 truncate">{user.email}</span>
            </div>
        </div>
        <button to="/signup"
            onClick={sendMoney}
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            Send Money</button>
    </div>
}
