import React from 'react'
import { Balance } from './Balance'
import { Users } from './Users'

export function Dashboard() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 w-full h-full rounded-lg text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 ">
            <div className="flex flex-col gap-0 w-full justify-between rounded-lg bg-white dark:bg-gray-800">
                <div className="flex flex-col overflow-y-auto py-4 px-4 h-full bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 gap-4">
                    <Balance></Balance>
                    <Users></Users>
                </div>
            </div>
        </section>
    )
}