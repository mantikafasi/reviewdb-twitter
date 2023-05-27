const { React } = window;

export default function Review() {
  return (
    <div className="tweet-wrap">
  <div className="tweet-header">
    <img src="https://pbs.twimg.com/profile_images/1012717264108318722/9lP-d2yM_400x400.jpg" alt="" className="avator" />
    <div className="tweet-header-info">
      Manti  <span>@mantikafasi1</span><span> Jun 27
        </span>
      <p>Soon you will explode</p>
    </div>
  </div>
  <style>
    {`
    .tweet-wrap {
      border-bottom: 1px solid #eee;
      padding: 10px;
      display: flex;
      flex-direction: column;
    }
    .tweet-header {
      display: flex;
      flex-direction: row;
    }
    .tweet-header-info {
      display: flex;
      flex-direction: column;
    }
    .tweet-header-info span {
      color: #555;
      font-size: 12px;
    }
    .tweet-header-info p {
      font-size: 14px;
    }
    .avator {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    `}
  </style>
</div>
  )
}
