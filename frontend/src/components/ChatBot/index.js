import { useEffect, useState } from "react"
import * as chatBotActions from '../../store/chatbot'
import { useDispatch, useSelector } from "react-redux"
import * as post from '../../store/posts'
import VideoCard from "../VideoCard"
import ImagesCard from "../ImagesCard"
import TextCard from "../TextCard"
import ProductsCard from "../ProductsCard"
import GoogleMaps from "../GoogleMaps"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import './index.css'

const languages = {
    "af": "Afrikaans", "sq": "Albanian", "am": "Amharic", "ar": "Arabic", "hy": "Armenian",
    "as": "Assamese", "ay": "Aymara", "az": "Azerbaijani", "bm": "Bambara", "eu": "Basque",
    "be": "Belarusian", "bn": "Bengali", "bho": "Bhojpuri", "bs": "Bosnian", "bg": "Bulgarian",
    "ca": "Catalan", "ceb": "Cebuano", "zh-CN": "Chinese (Simplified)", "zh-TW": "Chinese (Traditional)", "co": "Corsican",
    "hr": "Croatian", "cs": "Czech", "da": "Danish", "dv": "Dhivehi", "doi": "Dogri",
    "nl": "Dutch", "en": "English", "eo": "Esperanto", "et": "Estonian", "ee": "Ewe",
    "fil": "Filipino (Tagalog)", "fi": "Finnish", "fr": "French", "fy": "Frisian", "gl": "Galician",
    "ka": "Georgian", "de": "German", "el": "Greek", "gn": "Guarani", "gu": "Gujarati",
    "ht": "Haitian Creole", "ha": "Hausa", "haw": "Hawaiian", "he": "Hebrew", "hi": "Hindi",
    "hmn": "Hmong", "hu": "Hungarian", "is": "Icelandic", "ig": "Igbo", "ilo": "Ilocano",
    "id": "Indonesian", "ga": "Irish", "it": "Italian", "ja": "Japanese", "jv": "Javanese",
    "kn": "Kannada", "kk": "Kazakh", "km": "Khmer", "rw": "Kinyarwanda", "gom": "Konkani",
    "ko": "Korean", "kri": "Krio", "ku": "Kurdish", "ckb": "Kurdish (Sorani)", "ky": "Kyrgyz",
    "lo": "Lao", "la": "Latin", "lv": "Latvian", "ln": "Lingala", "lt": "Lithuanian",
    "lg": "Luganda", "lb": "Luxembourgish", "mk": "Macedonian", "mai": "Maithili", "mg": "Malagasy",
    "ms": "Malay", "ml": "Malayalam", "mt": "Maltese", "mi": "Maori", "mr": "Marathi",
    "mni-Mtei": "Meiteilon (Manipuri)", "lus": "Mizo", "mn": "Mongolian", "my": "Myanmar (Burmese)", "ne": "Nepali",
    "no": "Norwegian", "ny": "Nyanja (Chichewa)", "or": "Odia (Oriya)", "om": "Oromo", "ps": "Pashto",
    "fa": "Persian", "pl": "Polish", "pt": "Portuguese (Portugal, Brazil)", "pa": "Punjabi", "qu": "Quechua",
    "ro": "Romanian", "ru": "Russian", "sm": "Samoan", "sa": "Sanskrit", "gd": "Scots Gaelic",
    "nso": "Sepedi", "sr": "Serbian", "st": "Sesotho", "sn": "Shona", "sd": "Sindhi",
    "si": "Sinhala (Sinhalese)", "sk": "Slovak", "sl": "Slovenian", "so": "Somali", "es": "Spanish",
    "su": "Sundanese", "sw": "Swahili", "sv": "Swedish", "tl": "Tagalog (Filipino)", "tg": "Tajik",
    "ta": "Tamil", "tt": "Tatar", "te": "Telugu", "th": "Thai", "ti": "Tigrinya",
    "ts": "Tsonga", "tr": "Turkish", "tk": "Turkmen", "ak": "Twi (Akan)", "uk": "Ukrainian",
    "ur": "Urdu", "ug": "Uyghur", "uz": "Uzbek", "vi": "Vietnamese", "cy": "Welsh",
    "xh": "Xhosa", "yi": "Yiddish", "yo": "Yoruba", "zu": "Zulu"
};

export default function ChatBot() {

    const [body, setBody] = useState('')
    const [showBot, setShowBot] = useState(false)
    const [showConvos, setShowConvos] = useState(true)
    const [image, setImage] = useState(null)
    const dispatch = useDispatch()

    const convos = useSelector(state => state.chatBot.allConvos)
    const messages = useSelector(state => state.chatBot.singleConvo)

    const messageDiv = document.getElementById('messages')



    if (messageDiv) {
        messageDiv.scrollTop = messageDiv.scrollHeight
    }

    const handleClick = async () => {
        const client = new S3Client({ region: "us-west-2" });
        const command = new PutObjectCommand({
          Bucket: process.env.linque,
          Key: image.name,
          Body: image,
        });
console.log(command)
        try {
          const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
          console.log(`Successfully uploaded file. URL: ${signedUrl}`);
        } catch (err) {
          console.error("Error uploading file: ", err);
        }

        const newBody = { body: body, user: true }
        if (messages) {
            newBody.chatBotConvoId = Object.values(messages)[0].chatBotConvoId
        }
        console.log(newBody)
        dispatch(chatBotActions.createMessage(newBody)).then(async () => {
            const div = document.createElement("div");
            div.className = 'bot-message'
            messageDiv.appendChild(div)

            let audio;

            //fetch new audio
            const data = await fetch('/audio/audio.mp3');

            //parse audio
            const arrayBuffer = await data.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
            const newUrl = window.URL.createObjectURL(blob);

            //set audio
            audio = document.createElement("audio");
            audio.id = "audio";
            audio.src = newUrl;
            audio.load();
            audio.playbackRate = .9;
            audio.setAttribute("controls", "");
            console.log(audio.duration)
            audio.style.height = '30px'

            //append audio
            div.appendChild(audio);
            messageDiv.scrollTop = messageDiv.scrollHeight

            //start recognition when audio ends
            audio.play()

        })


        setBody('')
    }

    useEffect(() => {
        dispatch(chatBotActions.getAllConvos())
    }, [dispatch])

    useEffect(() => {
        if (messageDiv) {

            messageDiv.scrollTop = messageDiv.scrollHeight
        }

    }, [messages])

    return (
        showBot ? <div id='chat-box'>
            <div id='chatbox-header'>
                {!showConvos && <img src='/images/back.png' onClick={() => setShowConvos(true)} id='back-button' />}
                <h4>Chat Bot</h4>
                <div id='minimize' onClick={() => setShowBot(false)}><div></div></div>
            </div>
            {showConvos ? <div>
                <div
                    onClick={() => setShowConvos(false)}
                    className="chatbot-conversation"
                >
                    <p>New</p>
                </div>
                {
                    convos && Object.values(convos).map((convo) => {

                        return <div onClick={() => {
                            dispatch(chatBotActions.getOneConvo(convo.id))
                            setShowConvos(false)
                        }}
                            className="chatbot-conversation">
                            <p>{convo.title}</p>
                        </div>
                    })
                }
            </div> : <div id='convo'>
                <div id='messages'>
                    {
                        messages && Object.values(messages).map((message) => {

                            if (message.user) {

                                return <div className="user-message-container">
                                    <p className="user-message-language">{languages[message.language]}</p>
                                    <div className="user-message">
                                    {message.body}
                                </div>
                                </div>
                            }
                            else {
                                if (!message.engine) {
                                    return <div className="bot-message-container">
                                        <p className="message-language">{languages[message.language]}</p>
                                        <div className="bot-message">
                                        {message.body}
                                        </div>
                                    </div>
                                }
                                else {

                                    if (message.data) {

                                        if (message.engine === 'google_videos') {
                                            return <VideoCard message={message}/>
                                        }
                                        if (message.engine === 'google_images') {
                                            return <ImagesCard message={message}/>
                                        }
                                        if (message.engine === 'google_shopping') {
                                            return <ProductsCard message={message}/>
                                        }
                                        if (message.engine === 'google_maps') {
                                            return <div className="bot-message-container">
                                            <p className="message-language">{languages[message.language]}</p>
                                            <GoogleMaps message={message}/>
                                        </div>
                                        }
                                        return <TextCard message={message}/>
                                    }
                                }
                            }

                        })
                    }
                </div>
                    <form onSubmit={(e) => {e.preventDefault()}} encType="multipart/form-data">
                    <input
                            id="image"
                            className='create-resturant-input'
                            type="file"
                            accept="image/*"
                            onChange={(e) => {setImage(e.target.files[0]); }}
                        />
                        <button type='submit'>yoooo</button>
                        </form>
                <div id='input-div'>
                    <textarea
                        id='chatbox-text-input'
                        onChange={(e) => setBody(e.target.value)}
                        value={body}
                    />
                    <img src='/images/send.png' id='send-message-button' onClick={handleClick} />
                </div>
            </div>}
        </div> : <div id='bot-button' onClick={() => setShowBot(true)}>
            <h2>Bot</h2>
        </div>
    )
}
