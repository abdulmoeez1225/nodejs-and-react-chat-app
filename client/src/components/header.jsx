import { useEffect, useState } from "react";
import CreateChatRoomModel from "./CreateChatRoomModel";
import { socket } from "../utils";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))

    const [allRooms, setAllRooms] = useState([])
    const [allJoinedRooms, setAllJoinedRooms] = useState([])

    const [showModel, setShowModal] = useState(false)
    const [isShowAllAvailableRooms, setIsShowAllAvailableRooms] = useState(false)
    const [isShowAllJoinedRooms,setIsShowAllJoinedRooms] =useState(false)
    const navigation = useNavigate()



    useEffect(() => {
        socket.emit('getChatRooms')
        socket.on('chatRooms', chatRooms => {
            setAllRooms(chatRooms)
        });
        socket.emit("getAlljoinedRoomServer",user.id)
        socket.on("getAlljoinedRoomClient",(joinedRooms)=>{
            setAllJoinedRooms(joinedRooms)
        })
    }, [])



    const EnterInRoom = (roomName)=>{
        navigation(`room/${roomName}`)
    }







    return (<>
        <CreateChatRoomModel setShowModal={setShowModal} showModal={showModel} />
        <nav
            id="sidenav-1"
            className="w-[15%] left-0 top-0 z-[1035] h-full -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
            data-te-sidenav-init
            data-te-sidenav-hidden="false"
            data-te-sidenav-position="absolute">
            <ul className="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
                <li className="relative">
                    <Link
                        to='/'
                        className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                        data-te-sidenav-link-ref>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="relative">
                    <span
                        className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                        data-te-sidenav-link-ref>
                        <span
                            type="button"
                            onClick={() => setShowModal(true)}
                        >
                            Create Chat Room
                        </span>
                    </span>
                </li>
                <li className="relative">
                    <button
                        onClick={() => setIsShowAllJoinedRooms(!isShowAllJoinedRooms)}
                        className="flex h-12 w-[100%] cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                    >
                        <span>Joined Rooms</span>
                        <svg
                            className={`h-5 w-5 inline-block ml-2 transition-transform transform ${isShowAllAvailableRooms ? 'rotate-180' : 'rotate-0'
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.293 14.707a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L10 12.586l-4.293-4.293a1 1 0 10-1.414 1.414l5 5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    {isShowAllJoinedRooms && (
                        <div className="py-2 w-[200px] bg-white border border-gray-200 shadow-md">
                            {allJoinedRooms.map(item => {
                                return (
                                    <a
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                    >
                                        {item.name}
                                    </a>
                                )
                            })}

                        </div>
                    )}
                </li>
                <li className="relative">
                    <button
                        onClick={() => setIsShowAllAvailableRooms(!isShowAllAvailableRooms)}
                        className="flex h-12 w-[100%] cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                    >
                        <span>Available rooms</span>
                        <svg
                            className={`h-5 w-5 inline-block ml-2 transition-transform transform ${isShowAllAvailableRooms ? 'rotate-180' : 'rotate-0'
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.293 14.707a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L10 12.586l-4.293-4.293a1 1 0 10-1.414 1.414l5 5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    {isShowAllAvailableRooms && (
                        <div className="py-2 w-[200px] bg-white border border-gray-200 shadow-md">
                            {allRooms.map(item => {
                                return (
                                    <a
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        onClick={()=>EnterInRoom(item.name)}
                                    >
                                        {item.name}
                                    </a>
                                )
                            })}

                        </div>
                    )}
                </li>


            </ul>
        </nav>
    </>
    )
}
