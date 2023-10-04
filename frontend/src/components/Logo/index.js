import './index.css'

export default function Logo() {
    return (
        <div id='logo'>
            <a href='/'><h1>Linque</h1></a>
            <div id='social-container'>

            <a href='https://www.linkedin.com/in/romeo-galvan-9418b6225/' target='_blank'>
                <img src='images/icons/linkedin.png' className="social"/>
            </a>
            <a href='https://github.com/DudeWithOneLeg' target='_blank'>
                <img src='/images/icons/github-mark.png' className="social"/>
            </a>
            <a href='https://wellfound.com/u/romeo-galvan' target='_blank'>
                <img src='images/icons/wellfound.jpg' className="social"/>
            </a>
            </div>
        </div>
    )
}
