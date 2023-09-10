import * as chatBotActions from '../../store/chatbot'
import { useDispatch, useSelector } from "react-redux"

export default function ViewChatBotConvos({ convo, setShowConvos}) {

    const messages = useSelector(state => state.chatBot.singleConvo)
    const dispatch = useDispatch()

    return (
        <div onClick={() => {
            dispatch(chatBotActions.getOneConvo(convo.id)).then(() => {

                
                setShowConvos(false)
                const messageDiv = document.getElementById('messages')



                if (messageDiv) {
                    messageDiv.scrollTop = messageDiv.scrollHeight
                }
            })
        }}
            className="chatbot-conversation">
            <p>{convo.title}</p>
        </div>
    )
}
