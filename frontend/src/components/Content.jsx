import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import { Signin } from "./Signin"
import { Signup } from "./Signup"
import { Dashboard } from "./Dashboard"
import { SendMoney } from "./SendMoney"
import { CheckAuth } from './CheckAuth';



export function Content() {
    return <main className="flex flex-col p-8 bg-gray-200 justify-center items-center">

        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route element={<CheckAuth />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/send" element={<SendMoney />} />
            </Route>
            <Route path='*' element={<Navigate to="/signup" replace />}></Route>
        </Routes>

    </main>
}