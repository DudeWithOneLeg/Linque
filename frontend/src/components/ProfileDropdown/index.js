import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { googleLogout } from "@react-oauth/google";
import "./index.css";

export default function ProfileDropdown({ sessionUser }) {
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(true);

  const handleDropdown = () => {
    setHidden(!hidden);
  };

  const logout = () => {
    dispatch(sessionActions.logout());
    googleLogout();
  };

  return (
    <div id="profile-dropdown">
      <img
        onClick={handleDropdown}
        className="profile-image"
        src={
          sessionUser.pfp
            ? sessionUser.pfp
            : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU="
        }
      />
      {!hidden && (
        <div id="dropdown-list">
          <ul>
            <li>Hi, {sessionUser.firstName}</li>
            <li onClick={logout} id="logout">
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
