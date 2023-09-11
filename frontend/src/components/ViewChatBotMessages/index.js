import VideoCard from "../VideoCard"
import ImagesCard from "../ImagesCard"
import TextCard from "../TextCard"
import ProductsCard from "../ProductsCard"
import GoogleMaps from "../GoogleMaps"

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
    "id": "Indonesian", "iw": "Hebrew", "ga": "Irish", "it": "Italian", "ja": "Japanese", "jv": "Javanese",
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

export default function ViewChatBotMessages({messages}) {
    return (
        <div id='messages'>
                    {
                        (messages !== null && messages !== undefined) && Object.values(messages).map((message) => {


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
                                            return <VideoCard message={message} />
                                        }
                                        if (message.engine === 'google_images') {
                                            return <ImagesCard message={message} />
                                        }
                                        if (message.engine === 'google_shopping') {
                                            return <ProductsCard message={message} />
                                        }
                                        if (message.engine === 'google_maps') {
                                            return <div className="bot-message-container">
                                                <p className="message-language">{languages[message.language]}</p>
                                                <GoogleMaps message={message} />
                                            </div>
                                        }
                                        return <TextCard message={message} />
                                    }
                                }
                            }

                        })
                    }
                    {messages && Object.values(messages).length && Object.values(messages)[Object.values(messages).length - 1].user == 1 && <div className="bot-message-container">
                        <div className="bot-message">
                            Thinking...
                        </div>
                    </div>
                    }
                </div>
    )
}
