import React from 'react'
import { SearchUsers } from './SearchUsers'

export function Users() {
    return <>
        <span className='font-bold text-xl py-4'>Users</span>
        <SearchUsers></SearchUsers>
    </>
}