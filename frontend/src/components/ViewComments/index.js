import CreateComment from '../CreateComment'
import ViewComment from '../ViewComment'

import './index.css'

export default function ViewComments({ comments, postId, userId }) {



    return (
        <div className='view-comments'>
            <CreateComment postId={postId} key={postId} />
            {
                comments && Object.values(comments).length && Object.values(comments).slice(0, 2).map(comment => {
                    return <ViewComment comment={comment} userId={userId}/>
                })
            }
        </div>
    )
}
