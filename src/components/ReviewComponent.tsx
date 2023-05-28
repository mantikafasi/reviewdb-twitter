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
      <style>
        {`
    img {
      max-width:100%;
    }
    .avator {
      border-radius:100px;
      width:48px;
      margin-right: 15px;
    }


    .tweet-wrap {
      max-width:490px;
      margin: 0 auto;
      margin-top: 4px;
      padding: 10px;
      border-bottom: 1px solid #e6ecf0;
    }

    .tweet-header {
      display: flex;
      align-items:flex-start;
      font-size:14px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .tweet-header-info {
      font-weight:bold;
      color:white;
    }
    .tweet-header-info span {
      color:#657786;
      font-weight:normal;
      margin-left: 5px;
    }
    .tweet-header-info p {
      font-weight:normal;
      margin-top: 5px;

    }
    .tweet-img-wrap {
      padding-left: 60px;
    }

    .tweet-info-counts {
      display: flex;
      margin-left: 60px;
      margin-top: 10px;
    }
    .tweet-info-counts div {
      display: flex;
      margin-right: 20px;
    }
    @media screen and (max-width:430px){
      body {
        padding-left: 20px;
        padding-right: 20px;
      }
      .tweet-header {
        flex-direction:column;
      }
      .tweet-header img {
        margin-bottom: 20px;
      }
      .tweet-header-info p {
        margin-bottom: 30px;
      }
      .tweet-img-wrap {
        padding-left: 0;
      }
      .tweet-info-counts {
      display: flex;
      margin-left: 0;
    }
    .tweet-info-counts div {
      margin-right: 10px;
    }
    }
    `}
      </style>
    </div>
  )
}
