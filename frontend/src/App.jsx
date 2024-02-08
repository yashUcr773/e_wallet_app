import { Content } from "./components/Content"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from 'recoil'


function App() {

    return <div>
            <RecoilRoot>
                <BrowserRouter>
                    <Header></Header>
                    <Content></Content>
                    <Footer></Footer>
                </BrowserRouter>
            </RecoilRoot>
        </div>
}

export default App
