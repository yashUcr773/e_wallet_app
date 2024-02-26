import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { RecoilRoot } from 'recoil'
import { Main } from './components/Main'

export default function App() {
    return (
        <>
            <BrowserRouter>
                <RecoilRoot>
                    <Main></Main>
                </RecoilRoot>
            </BrowserRouter>
        </>
    )
}

