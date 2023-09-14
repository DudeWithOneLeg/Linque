import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../../store/session";
import './index.css'

export default function SignupForm() {

  let chunks = []

  const dispatch = useDispatch()
  const sessionUser = useSelector((state) => state.session.user);

  const [firstName, setFirstname] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [recording, setRecording] = useState(false)
  const recordRef = useRef(null)
  const audioRef = useRef(null)
  const [chunk, setChunk] = useState(null)



  // useEffect(() => {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     console.log("getUserMedia supported.");
  //     navigator.mediaDevices
  //       .getUserMedia(

  //         {
  //           audio: true,
  //         },
  //       )


  //       .then((stream) => {
  //          const mediaRecorder = new MediaRecorder(stream);
  //          mediaRecorder.ondataavailable = (e) => {
  //           setChunk(e.data)
  //           const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  //           const audioURL = window.URL.createObjectURL(blob);
  //           console.log(audioURL)
  //           console.log(chunks)
  //         };
  //         console.log(stream)
  //         recordRef.current = mediaRecorder
  //         console.log(mediaRecorder.state);
  //       })



  //       .catch((err) => {
  //         console.error(`The following getUserMedia error occurred: ${err}`);
  //       });
  //   } else {
  //     console.log("getUserMedia not supported on your browser!");
  //   }
  // }, [])



  const handleMic = () => {

    if (recordRef.current) {
      if (recording) {
        console.log('stopped')
        recordRef.current.stop()
        setRecording(false)

      }
      else {
        chunks = []
        console.log('started')
        recordRef.current.start()
        setRecording(true)

      }
    }
    else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia(

            {
              audio: true,
            },
          )


          .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            setRecording(true)

            mediaRecorder.ondataavailable = async (e) => {

              setRecording(false)
              chunks.push(e.data)
              console.log(chunks)
              const blob = new Blob(chunks, { type: "audio/ogg" });
              const filename = "audio.ogg";

              const audioFile = new File([blob], filename, { type: "audio/ogg" });
              console.log(audioFile)
              dispatch(sessionActions.createVoice(audioFile))



              const audioURL = window.URL.createObjectURL(blob);
              console.log(audioURL)

                //dispatch(sessionActions.createVoice(file))
                // You can now work with the binary data as needed


              // reader.readAsArrayBuffer(blob)
              // const buffer = await blob.arrayBuffer()
              // const unt = new Uint8Array(buffer)
              // console.log(unt)
              // const audioBuffer = Buffer.from(buffer, 'binary')
              // console.log(audioURL)
              // audioRef.current.src = audioURL
              // audioRef.current.load()
              console.log(recordRef.current.state)
            };

            console.log(stream)
            recordRef.current = mediaRecorder
            recordRef.current.start()

          })



          .catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    }
  }


  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(firstName, lastName)
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  }


  return (
    <div id='signup-form'>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFirstname(e.target.value)}
          placeholder='First name'
        />
        {errors.firstName && <p className='errors'>{errors.firstName}</p>}
        <input
          onChange={(e) => setLastName(e.target.value)}
          placeholder='Last name'
        />
        {errors.lastName && <p className='errors'>{errors.lastName}</p>}
        <input
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
        />
        {errors.username && <p className='errors'>{errors.username}</p>}
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        {errors.email && <p className='errors'>{errors.email}</p>}
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          type='password'
        />
        {errors.password && <p className='errors'>{errors.password}</p>}
        <input
          id='confirm-password'
          placeholder="Confirm Password"
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p class='errors'>{errors.confirmPassword}</p>}
        {
          navigator.mediaDevices && navigator.mediaDevices.getUserMedia && <img src='/images/microphone.png' id='sign-up-mic' onClick={handleMic} />
        }
        <audio controls ref={audioRef} />
        <button type='submit'>Sign up</button>
      </form>
    </div>

  )
}
