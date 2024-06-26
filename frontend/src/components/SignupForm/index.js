import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { languageNames, languageCodes } from "./languages";
import GoogleLoginComp from "../GoogleLoginComp";

import "./index.css";

export default function SignupForm() {
  let chunks = [];

  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const authUser = useSelector((state) => state.session.oauth);

  if (authUser && authUser.exists)
    dispatch(sessionActions.setUser(authUser.user));

  const [firstName, setFirstname] = useState(
    (authUser && authUser.firstName) || ""
  );
  const [lastName, setLastName] = useState(
    (authUser && authUser.lastName) || ""
  );
  const [email, setEmail] = useState((authUser && authUser.email) || "");
  const [googleAccId, setGoogleAccId] = useState(
    (authUser && authUser.googleAccId) || ""
  );
  const [pfp, setPfp] = useState((authUser && authUser.pfp) || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [recording, setRecording] = useState(false);
  const [voice_id, setVoiceId] = useState(null);
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  const recordRef = useRef(null);
  const audioRef = useRef(null);

  const handleMic = () => {
    if (recordRef.current) {
      if (recording) {
        console.log("stopped");
        recordRef.current.stop();
        setRecording(false);
      } else {
        chunks = [];
        console.log("started");
        recordRef.current.start();
        setRecording(true);
      }
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })

          .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            setRecording(true);

            mediaRecorder.ondataavailable = async (e) => {
              setRecording(false);
              chunks.push(e.data);
              console.log(chunks);
              const blob = new Blob(chunks, { type: "audio/ogg" });
              const filename = "audio.ogg";

              const audioFile = new File([blob], filename, {
                type: "audio/ogg",
              });
              console.log(audioFile);
              dispatch(sessionActions.createVoice(audioFile)).then((data) => {
                if (data && data.voice_id) {
                  setVoiceId(data.voice_id);
                }
              });

              const audioURL = window.URL.createObjectURL(blob);
              setAudioURL(audioURL);
              audioRef.current.load();

              console.log(recordRef.current.state);
            };

            console.log(stream);
            recordRef.current = mediaRecorder;
            recordRef.current.start();
          })

          .catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    }
  };

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(firstName, lastName);
    if (password === confirmPassword) {
      setErrors({});
      const newUser = {
        email,
        firstName,
        lastName,
        password,
      };
      if (voice_id) newUser.voice_id = voice_id;
      if (defaultLanguage)
        newUser.defaultLanguage = languageCodes[defaultLanguage];
      if (googleAccId) newUser.googleAccId = googleAccId;
      if (typeof pfp !== "object") newUser.pfp = pfp;

      console.log(newUser);
      return dispatch(sessionActions.signup(newUser))
        .then((user) => {
          if (typeof pfp === "object") {
            dispatch(sessionActions.uploadImage(user.id, pfp));
          }
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return !authUser ? (
    <div id="signup">
      <form onSubmit={handleSubmit} id="signup-form">
        <div id="signup-image-container">
          <p>Photo</p>
          <input
            id="signup-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setPfp(e.target.files[0]);
            }}
          />
        </div>
        <input
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="First name"
        />
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <input
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        {errors.email && <p className="errors">{errors.email}</p>}
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        {errors.password && <p className="errors">{errors.password}</p>}
        <input
          id="confirm-password"
          placeholder="Confirm Password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p class="errors">{errors.confirmPassword}</p>
        )}
        <select onChange={(e) => setDefaultLanguage(e.target.value)}>
          <option value="" disabled selected>
            Default Language
          </option>
          {languageNames.map((name) => {
            return <option value={languageCodes[name]}>{name}</option>;
          })}
        </select>
        {navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia &&
          !recording && (
            <img
              src="/images/icons/microphone.png"
              className="sign-up-mic"
              onClick={handleMic}
            />
          )}
        {navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (
          <p id="script">
            I let the positive overrule the negative. He wiped his brow with his
            forearm. Instead of fixing it, they give it a nickname. About half
            the people who are infected also lose weight. The second half of the
            book focuses on argument and essay writing. We have the means to
            help ourselves. The large items are put into containers for
            disposal. He loves to watch me drink this stuff. Still, it is an odd
            fashion choice. Funding is always an issue after the fact. Let us
            encourage each other.
          </p>
        )}
        {recording && (
          <img
            src="/images/icons/stop-record.png"
            className="sign-up-mic"
            onClick={() => {
              setRecording(false);
              recordRef.current.stop();
            }}
            id="stop-record"
          />
        )}
        {audioURL && (
          <audio controls ref={audioRef} id="signup-audio" src={audioURL} />
        )}
        <button type="submit" id="signup-button">
          Sign up
        </button>
      </form>
    </div>
  ) : (
    <div id="signup">
      <form onSubmit={handleSubmit} id="signup-form">
        {!authUser.firstName && (
          <input
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First name"
          />
        )}
        {errors.firstName && !authUser.firstName && (
          <p className="errors">{errors.firstName}</p>
        )}
        {!authUser.lastName && (
          <input
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        )}
        {errors.lastName && !authUser.lastName && (
          <p className="errors">{errors.lastName}</p>
        )}
        {!authUser.email && (
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        )}
        {errors.email && !authUser.lastName && (
          <p className="errors">{errors.email}</p>
        )}
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        {errors.password && <p className="errors">{errors.password}</p>}
        <input
          id="confirm-password"
          placeholder="Confirm Password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p class="errors">{errors.confirmPassword}</p>
        )}
        <select onChange={(e) => setDefaultLanguage(e.target.value)}>
          <option value="" disabled selected>
            Default Language
          </option>
          {languageNames.map((name) => {
            return <option value={languageCodes[name]}>{name}</option>;
          })}
        </select>
        {navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia &&
          !recording && (
            <img
              src="/images/microphone.png"
              className="sign-up-mic"
              onClick={handleMic}
            />
          )}
        {navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (
          <p id="script">
            I let the positive overrule the negative. He wiped his brow with his
            forearm. Instead of fixing it, they give it a nickname. About half
            the people who are infected also lose weight. The second half of the
            book focuses on argument and essay writing. We have the means to
            help ourselves. The large items are put into containers for
            disposal. He loves to watch me drink this stuff. Still, it is an odd
            fashion choice. Funding is always an issue after the fact. Let us
            encourage each other.
          </p>
        )}
        {recording && (
          <img
            src="/images/icons/stop-record.png"
            className="sign-up-mic"
            onClick={() => {
              setRecording(false);
              recordRef.current.stop();
            }}
            id="stop-record"
          />
        )}
        {audioURL && (
          <audio controls ref={audioRef} id="signup-audio" src={audioURL} />
        )}
        <button type="submit" id="signup-button">
          Sign up
        </button>
      </form>
    </div>
  );
}
