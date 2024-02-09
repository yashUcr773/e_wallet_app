import { FormComponent } from './FormComponent'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '../store/atoms/user'
import axios from 'axios'
import { useEnterListener } from '../hooks/useEnterListener'
import { useState } from 'react'
import { CONSTANTS } from '../../config/CONSTANTS'
import { Loader } from './Loader'

export function UpdateInfo() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [formError, setFormError] = useState("")
    const [showLoader, setshowLoader] = useState("")
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [user, setUser] = useRecoilState(userAtom)
    useEnterListener([firstName, lastName, password], updateDetails)

    async function updateDetails() {
        try {

            setshowLoader(true)
            let response = await axios.put(CONSTANTS.APIBASEURL + '/user', { firstname: firstName, lastname: lastName, password }, { headers: { Authorization: localStorage.getItem('token') } })
            setshowLoader(false)
            setUpdateSuccess(true)
            setFirstName("")
            setLastName("")
            setPassword("")
            setFormError(response.data.message)
            
            setUser((p) => ({
                ...p,
                firstname: response.data.data.firstname, lastname: response.data.data.lastname
            }))
            
        } catch (e) {
            console.log(e)
            setFormError(e.response.data.message)
            setUpdateSuccess(false)
            setshowLoader(false)
        }
    }


    return <div className='flex items-center justify-center  font-medium sm:font-semibold text-lg sm:text-xl'>
        <div className='form border shadow-lg p-8 bg-white rounded-2xl w-full sm:w-[500px]'>
            <div className='form-header flex flex-col gap-4 justify-center items-center mb-8'>
                <h3 className='font-extrabold text-3xl sm:text-4xl'>Update</h3>
                <span className='text-slate-500 text-center'>Enter details to update</span>
            </div>
            <div className='form-content flex flex-col gap-2'>
                <FormComponent label={"Firstname"} placeholder={user.firstname} type={"text"} formSetter={setFirstName} value={firstName}/>
                <FormComponent label={"Lastname"} placeholder={user.lastname} type={"text"} formSetter={setLastName} value={lastName}/>
                <FormComponent label={"Password"} placeholder={""} type={"password"} formSetter={setPassword} value={password}/>
            </div>
            <div className='form-footer flex flex-col justify-center items-center'>
                <div className={`error-container ${updateSuccess ? 'text-green-600' : 'text-red-500'} p-2 mt-2`}>{formError}</div>
                <button className='w-full border-2 p-4 mt-4 rounded-xl bg-black text-white border-black flex flex-row gap-2 justify-center items-center h-16' onClick={updateDetails}>Update {showLoader ? <Loader></Loader> : null}</button>
            </div>
        </div>
    </div>
}