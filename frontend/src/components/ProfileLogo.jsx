export function ProfileLogo({ content }) {
    return <div className=' cursor-pointer flex profile-circle border border-slate-500 bg-slate-400 rounded-full p-2 w-12 h-12 items-center justify-center'>
        <span className='font-bold text-xl select-none'>{content}</span>
    </div>
}