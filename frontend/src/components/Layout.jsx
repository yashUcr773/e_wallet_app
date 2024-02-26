import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";


export function Layout() {
    return (
        <div className="app w-full min-h-[100vh] max-w-[98%] sm:max-w-[95%] md:max-w-[90%] px-2 sm:px-4 mx-auto pt-4 sm:pt-0 flex flex-col justify-between gap-4 text-gray-900 dark:text-white">
            <Header></Header>
            <main className="main flex flex-col items-center justify-start">
                <Outlet />
            </main>
            <Footer></Footer>
        </div>
    )
}