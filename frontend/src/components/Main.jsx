import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { IsLoggedInComponent } from "./IsLoggedInComponent";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { PersistentLogin } from "./PersistentLogin";
import { RequireAuth } from "./RequireAuth";
import { SendMoney } from "./SendMoney";
import { UpdateInfo } from "./UpdateInfo";
import { Dashboard } from "./Dashboard";
import { NotFound } from "./NotFound";


export function Main() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>

                {/* public routes */}
                <Route element={<IsLoggedInComponent />}>
                    <Route path='signin' element={<Signin />}></Route>
                    <Route path='signup' element={<Signup />}></Route>
                </Route>

                {/* Protected */}
                <Route element={<PersistentLogin />}>
                    <Route element={<RequireAuth />} >
                        <Route path='/' element={<Dashboard />}></Route>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/send" element={<SendMoney />} />
                        <Route path="/update" element={<UpdateInfo />} />
                    </Route>
                </Route>
                {/* Catch All */}
                <Route path='*' element={<NotFound />}></Route>

            </Route>
        </Routes >
    )
}
