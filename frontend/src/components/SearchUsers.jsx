import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CONSTANTS } from '../../config/CONSTANTS'
import { useNavigate } from 'react-router-dom'
import { Loader } from './Loader'

let timeout;
export function SearchUsers() {
    const [filter, setFilter] = useState("")
    const [users, setUsers] = useState([])
    const [networkCallStatus, setNetworkCallStatus] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers(f) {
        try {

            let response = await axios.get(CONSTANTS.APIBASEURL + '/user/bulk?filter=' + (f || ""), {
                headers: {
                    'authorization': localStorage.getItem('token'),
                }
            })
            setUsers(response.data.users)
        } catch (e) {
            console.log(e)
        }
        setNetworkCallStatus(true)

    }

    async function filterChangeHandler(e) {
        setFilter(e.target.value)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fetchUsers(e.target.value)
        }, 1000)
    }

    return <>
        <input className='p-2 border border-slate-300 bg-gray-50 rounded-md' placeholder='Search users...' value={filter} onChange={(e) => filterChangeHandler(e)}></input>
        {networkCallStatus ? <div className='users-container flex flex-col gap-8 mt-8'>
            {users.map(user => { return <User key={user._id} user={user}></User> })}
        </div> : <div className="flex flex-row justify-center items-center mt-8"><Loader></Loader></div>}
    </>
}

export function User({ user }) {

    const navigate = useNavigate()

    function sendMoney() {
        navigate('/send', { state: user })
    }

    return <div className='user-container flex flex-row items-center justify-between'>
        <div className='name-container flex flex-row items-center gap-4'>
            <div className='flex profile-circle border border-slate-500 bg-slate-400 rounded-full p-2 w-12 h-12 items-center justify-center'>
                <span className='font-bold text-xl'>{user.firstname[0]}</span>
            </div>
            <span className='text-lg'>{user.firstname} {user.lastname}</span>
        </div>
        <button className='bg-black border border-black text-white px-2 sm:px-6 py-3 rounded-lg' onClick={sendMoney}>Send Money</button>
    </div>
}
