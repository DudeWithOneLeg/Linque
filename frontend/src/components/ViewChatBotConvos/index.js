import * as chatBotActions from '../../store/chatbot'
import { useDispatch} from "react-redux"

export default function ViewChatBotConvos({ convo, setShowConvos}) {

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
