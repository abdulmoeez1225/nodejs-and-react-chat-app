import { useEffect, useRef, useState } from 'react'
import Img1 from '../../assets/img1.jpg'
import tutorialsdev from '../../assets/tutorialsdev.png'
import Input from '../../components/Input'
import { io } from 'socket.io-client'
import Avatar from 'react-avatar';
import { socket } from '../../utils'
import { useLocation, useParams } from 'react-router-dom'


const Room = () => {
    let { roomName } = useParams();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState({ messages: [] })
    const [message, setMessage] = useState('')
    const [roomDetail, setRoomDetail] = useState({})
    const messageRef = useRef(null)
    const [activityUser, setActivityUser] = useState("")
    const location = useLocation()


    useEffect(() => {
        if (socket) {
            let activityTimer

            socket.emit("joinRoom", { roomName: roomName, userId: user.id, userName: user.fullName })
            socket.emit("getAlljoinedRoomServer", user.id)
            socket.on('activity', (name) => {

                setActivityUser(name)
                clearTimeout(activityTimer)
                activityTimer = setTimeout(() => {
                    setActivityUser('')
                }, 3000)
            })
            socket.on('getAllRoomMembersClient', (AllRoomMembers) => {
                setRoomDetail(AllRoomMembers)
            })
            socket.emit('getAllRoomConversationServer', roomName)

            setTimeout(async () => {
                socket.emit("getAllRoomMembersServer", roomName)
            }, 1500)

            socket.on('getAllRoomConversationClient', (roomConversation) => {

                const result = roomConversation.map(coversation => {
                    const { _id, fullName, email } = coversation.senderId
                    const user = { id: _id, fullName: fullName, email }
                    return {
                        user: user,
                        message: coversation.message
                    }
                })

                setMessages({ messages: result })
            })
            socket.on('toRoomMessage', (data) => {
                setMessages(prev => (
                    {
                        ...prev,
                        messages: [...prev.messages, { user: data?.user, message: data?.message }]
                    }))
            })
        }
    }, [location.pathname, socket])
    console.log({ activityUser })
    useEffect(() => {
        if (socket) {
            socket?.emit('addUser', user?.id);


        }
    }, [socket])

    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages?.messages])



    

    const sendMessage = async (e) => {
        setMessage('')
        socket?.emit('sendMessageRoomServer', {
            senderId: user?.id,
            chatRoomId: roomDetail._id,
            message,
            roomName: roomDetail.name
        });



    }

    return (
        <div className='w-screen flex w-[85%] '>
            <div className='w-[20%] h-screen bg-secondary overflow-scroll'>
                <div className='flex items-center my-8 mx-14'>

                    <div>
                        <Avatar name={user?.fullName} size='30' />

                    </div>
                    <div className='ml-8'>
                        <h3 className='text-2xl'>{roomName}</h3>
                    </div>
                </div>
                <hr />
                
            </div>
            <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
                {
                    messages?.receiver?.fullName &&


                    <div className='w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2'>
                        <div className='cursor-pointer'>
                            <Avatar name={messages?.receiver?.fullName} size='30' />
                        </div>
                        <div className='ml-6 mr-auto'>
                            <h3 className='text-lg'>{messages?.receiver?.fullName}</h3>
                            <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
                        </div>
                        <div className='cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                <line x1="15" y1="9" x2="20" y2="4" />
                                <polyline points="16 4 20 4 20 8" />
                            </svg>
                        </div>
                    </div>


                }
                <div className='h-[75%] w-full overflow-scroll shadow-sm'>
                    <div className='p-14'>
                        {
                            messages?.messages?.length > 0 ?
                                messages.messages.map(({ message, user: { id, fullName } = {} }) => {
                                    return (
                                        <>

                                            <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${id === user?.id ? 'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'} `}>
                                                <p style={{ fontSize: 12 }}>{fullName}</p>
                                                {message}
                                            </div>
                                            <div ref={messageRef}></div>
                                        </>
                                    )
                                }) : <div className='text-center text-lg font-semibold mt-24'>No Messages or No Conversation Selected</div>
                        }
                    </div>
                </div>
                {activityUser && <span>{`${activityUser} is typing...`}</span>}
                <div className='p-14 w-full flex items-center'>
                    <Input placeholder='Type a message...' value={message} onChange={(e) => {
                        setMessage(e.target.value)
                        socket.emit('activity', user.fullName)
                    }} className='w-[75%]' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
                    <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                            <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                        </svg>
                    </div>
                    <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                            <line x1="12" y1="9" x2="12" y2="15" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className='w-[30%] h-screen bg-light px-8 py-16 overflow-scroll'>
                <div className='text-primary text-lg'>People</div>
                <div>
                    {
                        roomDetail?.members?.length > 0 ?
                            roomDetail?.members?.map((roomUser) => {
                                return (
                                    <div className='flex items-center py-8 border-b border-b-gray-300'>
                                        <div className='cursor-pointer flex items-center'>
                                            <div>
                                                <Avatar name={roomUser?.fullName} size='30' />
                                            </div>
                                            <div className='ml-6'>
                                                <h3 className='text-lg font-semibold'>{roomUser?.fullName}</h3>
                                                <p className='text-sm font-light text-gray-600'>{roomUser?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Room