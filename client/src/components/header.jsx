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

    return (
        <div className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <a href="#" className="text-4xl font-bold text-gradient">Live Chat</a>
                </a>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                <a class="mr-5 hover:text-gray-900">Create Room Link</a>
                    <div className="group relative cursor-pointer py-2">
                        <div className="flex items-center justify-between space-x-5 bg-white px-4">
                            <a
                                className="menu-hover my-2 py-2 text-base font-medium text-black lg:mx-4"
                            >
                                All available Rooms
                            </a>
                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </span>
                        </div>
                        <div
                            className="invisible absolute z-50 flex w-full flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible"
                        //   onClick=""
                        >

                            {rooms.map(room => {
                                return (<a href="#" className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2"
                                >{room}</a>)
                            })}
                           
                        </div>
                    </div>


                </nav>

            </div>
        </div>
    );
}
