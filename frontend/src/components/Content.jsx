import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { Signin } from "./Signin"
import { Signup } from "./Signup"
import { Dashboard } from "./Dashboard"
import { SendMoney } from "./SendMoney"


export function Content() {
    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/send" element={<SendMoney />} />
                <Route path='*' element={<Navigate to="/signup" replace />}></Route>
            </Routes>
        </BrowserRouter>
    </div>
}