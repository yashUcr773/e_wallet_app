import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CONSTANTS } from '../../config/CONSTANTS'
import { useNavigate } from 'react-router-dom'

let timeout;
export function SearchUsers() {
    const [filter, setFilter] = useState("")
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {

            let response = await axios.get(CONSTANTS.APIBASEURL + '/user/bulk?filter=' + filter, {
                headers: {
                    'authorization': localStorage.getItem('token'),
                }
            })
            setUsers(response.data.users)
        } catch (e) {
            console.log(e)
        }
    }

    async function filterChangeHandler(e) {
        setFilter(e.target.value)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fetchUsers()
        }, 1000)
    }

    return <>
        <input className='p-2 border border-slate-300 bg-gray-50 rounded-md' placeholder='Search users...' value={filter} onChange={(e) => filterChangeHandler(e)}></input>
        <div className='users-container flex flex-col gap-8 mt-8'>
            {users.map(user => { return <User key={user._id} user={user}></User> })}
        </div>
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
        <button className='bg-black border border-black text-white px-6 py-3 rounded-lg' onClick={sendMoney}>Send Money</button>
    </div>
}
