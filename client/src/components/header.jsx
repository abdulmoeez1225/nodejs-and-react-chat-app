import { useEffect, useState } from "react";

export default function Header() {

    const [rooms, setRooms] = useState([])


    useEffect(() => {
        // fetch("http://localhost:3500/getrooms").then(async (response) => {
        //     setRooms(await response.json())
        // }).catch((error) => {
        //     console.log(error)
        // })
    }, [])

    // return (
    //     <div className="text-gray-600 body-font">
    //         <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    //             <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
    //                 <a href="#" className="text-4xl font-bold text-gradient">Live Chat</a>
    //             </a>
    //             <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
    //             <a class="mr-5 hover:text-gray-900">Create Room Link</a>
    //                 <div className="group relative cursor-pointer py-2">
    //                     <div className="flex items-center justify-between space-x-5 bg-white px-4">
    //                         <a
    //                             className="menu-hover my-2 py-2 text-base font-medium text-black lg:mx-4"
    //                         >
    //                             All available Rooms
    //                         </a>
    //                         <span>
    //                             <svg
    //                                 xmlns="http://www.w3.org/2000/svg"
    //                                 fill="none"
    //                                 viewBox="0 0 24 24"
    //                                 stroke-width="1.5"
    //                                 stroke="currentColor"
    //                                 className="h-6 w-6"
    //                             >
    //                                 <path
    //                                     stroke-linecap="round"
    //                                     stroke-linejoin="round"
    //                                     d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    //                                 />
    //                             </svg>
    //                         </span>
    //                     </div>
    //                     <div
    //                         className="invisible absolute z-50 flex w-full flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible"
    //                     //   onClick=""
    //                     >

    //                         {rooms.map(room => {
    //                             return (<a href="#" className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2"
    //                             >{room}</a>)
    //                         })}

    //                     </div>
    //                 </div>


    //             </nav>

    //         </div>
    //     </div>
    // );
    return (
        <nav
            id="sidenav-1"
            class="absolute w-[10%] left-0 top-0 z-[1035] h-full -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
            data-te-sidenav-init
            data-te-sidenav-hidden="false"
            data-te-sidenav-position="absolute">
            <ul class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
                <li class="relative">
                    <a
                        class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                        data-te-sidenav-link-ref>
                        <span>Home</span>
                    </a>
                </li>
                <li class="relative">
                    <a
                        class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                        data-te-sidenav-link-ref>
                        <span>Rooms</span>
                    </a>
                </li>
              
            </ul>
        </nav>
    )
}
