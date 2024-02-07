import React from 'react'
import { Balance } from './Balance'
import { Users } from './Users'

export function Dashboard() {
    return <div className='w-full flex flex-col'>
        <Balance></Balance>
        <Users></Users>
    </div>
}