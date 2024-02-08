import { memo, useState } from "react"
import { ShowPassword } from './SVGs/ShowPassword'
import { HidePassword } from './SVGs/HidePassword'

export const FormComponent = memo(({ label, placeholder, type, formSetter, errorObj, errorKey, errorObjSetter }) => {

    const [showPassword, setShowPassword] = useState(false)

    function handleChange(e) {
        formSetter(e.target.value)
        errorObjSetter((p) => ({ ...p, [errorKey]: false }))
    }

    function handleShowPasswordClick(show) {
        setShowPassword(show)
    }

    return <div className='form-row flex flex-col gap-2 mb-2 relative'>
        <label className='font-bold text-xl'>{label}</label>
        <input placeholder={placeholder} type={type == 'password' && showPassword ? "text" : type}
            onChange={handleChange}
            className={`border-2 border-slate-200 rounded-md font-semibold text-xl p-2.5 px-3 bg-gray-50 ${errorObj[errorKey] ? 'border-red-200' : ''}`}></input>
        <div className="absolute right-3 top-12 bg-white cursor-pointer">
            {type == 'password' ? <div>
                {showPassword ?
                    <div onClick={() => handleShowPasswordClick(false)}><ShowPassword /></div> :
                    <div onClick={() => handleShowPasswordClick(true)}> <HidePassword /></div>
                }
            </div> :
                ""}
        </div>
    </div>
})