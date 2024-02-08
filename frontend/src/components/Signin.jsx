import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FormComponent } from './FormComponent';
import axios from 'axios'
import { CONSTANTS } from "../../config/CONSTANTS"
import { isSignedInAtom, userAtom } from '../store/atoms/user'
import { useSetRecoilState } from 'recoil'
import { Loader } from './Loader';

export function Signin() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorObj, setErrorObj] = useState({
        email: false,
        pass: false
    })
    const [formError, setFormError] = useState("")
    const setUser = useSetRecoilState(userAtom)
    const setIsSignedIn = useSetRecoilState(isSignedInAtom)
    const [showLoader, setShowLoader] = useState(false)

    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault();
                handleSignIn()
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [email, password]);

    async function handleSignIn() {

        let earlyReturn = false
        setFormError("")
        if (!email || email == "") {
            setErrorObj((p) => ({ ...p, 'email': true }))
            setFormError("Enter valid credentials")
            earlyReturn = true
        }
        if (!password || password == "") {
            setErrorObj((p) => ({ ...p, 'pass': true }))
            setFormError("Enter valid credentials")
            earlyReturn = true
        }
        if (earlyReturn) return

        try {

            setShowLoader(true)
            let response = await axios.post(CONSTANTS.APIBASEURL + '/user/signin', {
                email, password
            })
            setShowLoader(false)

            localStorage.setItem('token', `Bearer ${response.data.token}`)
            setIsSignedIn(true)
            setUser({
                firstname: response.data.firstname, lastname: response.data.lastname, email: response.data.email, userId: response.data.userId
            })
            navigate('/dashboard')

        } catch (e) {
            setFormError(e.response.data.message)
        }
        setShowLoader(false)

    }

    return <div className='flex items-center justify-center h-[75vh]'>
        <div className='form border shadow-lg p-8 bg-white rounded-2xl w-[500px]'>
            <div className='form-header flex flex-col gap-4 justify-center items-center mb-8'>
                <h3 className='font-extrabold text-5xl'>Sign In</h3>
                <span className='text-slate-500 text-2xl font-semibold text-center'>Enter your credentials to access your account</span>
            </div>
            <div className='form-content flex flex-col gap-2'>
                <FormComponent label={"Email"} placeholder={"johndoe@example.com"} type={"text"} formSetter={setEmail}
                    errorObj={errorObj} errorKey={'email'} errorObjSetter={setErrorObj} />
                <FormComponent label={"Password"} placeholder={""} type={"password"} formSetter={setPassword}
                    errorObj={errorObj} errorKey={'pass'} errorObjSetter={setErrorObj} />
            </div>
            <div className='form-footer flex flex-col justify-center items-center'>
                <div className='error-container text-red-500 font-semibold text-xl p-2 mt-2'>{formError}</div>
                <button className='w-full border-2 p-4 text-xl mt-4 rounded-xl bg-black text-white border-black flex flex-row gap-2 justify-center items-center h-16' onClick={handleSignIn}>Sign in {showLoader ? <Loader></Loader> : null}</button>
                <span className='w-full text-center mt-6 font-medium text-xl'>Don't have an account? <a className='underline cursor-pointer' onClick={() => { navigate('/signup') }}>Sign Up</a></span>
            </div>
        </div>
    </div>

}