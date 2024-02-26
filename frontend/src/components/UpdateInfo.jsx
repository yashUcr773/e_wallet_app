import { useRecoilState } from 'recoil'
import { userAtom } from '../store/atoms/user'
import { useState } from 'react'
import { CONSTANTS } from '../../config/CONSTANTS'
import { Loader } from './Loader'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'

export function UpdateInfo() {

    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [formError, setFormError] = useState("")
    const [showLoader, setshowLoader] = useState("")
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [user, setUser] = useRecoilState(userAtom)
    const customAxios = useAxiosPrivate()

    async function updateDetails(e) {
        e.preventDefault()
        try {
            setshowLoader(true)
            let response = await customAxios.put(CONSTANTS.USER.PUT_USER(), { firstname, lastname, password })
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
        } finally {

            setshowLoader(false)
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-4 items-center justify-start mt-8 px-6 py-8 mx-auto lg:py-0 ">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-primary-500 border border-primary-500">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Enter details to update
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={updateDetails}>
                            <div>
                                <label htmlFor="firstname"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    Firstname</label>
                                <input type="text" name="firstname" id="firstname"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstname}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={user.firstname} />
                            </div>

                            <div>
                                <label htmlFor="lastname"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    Lastname</label>
                                <input type="text" name="lastname" id="lastname"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastname}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={user.lastname} />
                            </div>

                            <div>
                                <label htmlFor="password"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    Password</label>
                                <input type="password" id="password" name="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={"••••••••"} />
                            </div>

                            <p className={`rounded-lg w-full text-center text-sm font-normal ${updateSuccess ? 'text-green-600' : 'text-red-600'} whitespace-break-spaces`}>{formError}</p>

                            <button type="submit"
                                className="flex flex-row items-center justify-center gap-4 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Update {showLoader ? <Loader size={'sm'} /> : null}
                            </button>
                        </form>

                    </div>

                </div >
            </div >
        </section >
    )
}
