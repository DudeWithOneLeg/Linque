import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as friendActions from "../../store/friends";
import "./index.css";

export default function ViewUsers({ searchTerm }) {
  const dispatch = useDispatch();

  const currUser = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.friend.users);

  const [filtered, setFiltered] = useState(users || null);

  useEffect(() => {
    if (users) {
      const newUsers = Object.values(users).filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const obj = {};

      for (let user of newUsers) {
        obj[user.id] = user;
      }
      setFiltered(obj);
    }
  }, [searchTerm, users]);

  return (
    <div id="view-users">
      {filtered && Object.values(filtered).length ? (
        Object.values(filtered).map((user) => {
          let status;

          if (
            user.Friendship &&
            user.Friendship.status &&
            (user.Friendship.toUserId === currUser.id ||
              user.Friendship.fromUserId === currUser.id)
          ) {
            const currStatus = user.Friendship.status.split("");
            currStatus[0] = currStatus[0].toUpperCase();
            status = currStatus.join("");
          } else {
            status = "Add Friend";
          }

          if (user.id !== currUser.id)
            return (
              <div className="user-card" key={user.id}>
                <div className="user-info">
                  <img src={user.pfp} className="profile-image" />
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                {status === "Pending" &&
                  user.Friendship.toUserId !== currUser.id && <p>{status}</p>}
                {status === "Add Friend" &&
                  user.Friendship.toUserId !== currUser.id && (
                    <p
                      onClick={() => {
                        dispatch(friendActions.requestFriend(user.id));
                        dispatch(friendActions.getUsers());
                      }}
                      className="friend-button"
                    >
                      {status}
                    </p>
                  )}
                {status === "Pending" &&
                  user.Friendship.toUserId === currUser.id && (
                    <p
                      className="friend-button"
                      onClick={() => {
                        dispatch(
                          friendActions.updateFriendship(user.Friendship.id)
                        );
                        console.log(user.Friendship.id);
                      }}
                    >
                      Accept
                    </p>
                  )}
                {status === "Friends" && <p>{status}</p>}
              </div>
            );
        })
      ) : (
        <>No results for "{searchTerm}"</>
      )}
    </div>
  );
}
