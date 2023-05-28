import { Review } from '../utils/entities';
import './Reviews.css';

export default function ReviewComponent(props: { review: Review }) {
  console.log(props.review);
  return (
    <div className="tweet-wrap">
      <div className="tweet-header">
        <img src={props.review.sender.avatarURL} alt="" className="avator" />
        <div className="tweet-header-info">
          {props.review.sender.displayName  }  <span>{props.review.sender.username}</span><span> {new Date(props.review.timestamp * 1000).toLocaleString()}
          </span>
          <p>{props.review.comment}</p>
        </div>
      </div>
    </div>
  )
}
