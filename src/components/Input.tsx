import "./Input.css";
import "./Reviews.css";
type Props = {}

export default function Input({ }: Props) {
    const [text, setText] = React.useState<string>("");
    const [token, setToken] = React.useState<string>("");

    Extension.getToken().then(({ token }) => {
        console.log(token);
        token && setToken(token);
    });

    function handleClick(s: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (token.length === 0) {
            window.open("https://twitter.com/i/oauth2/authorize?response_type=code&client_id=SFVDakw2VVg3V2VrTVlNVkNTS0Y6MTpjaQ&redirect_uri=https://manti.vendicated.dev/api/reviewdb-twitter/auth&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain");
            s.target.textContent = "Please Refresh the page after authorization";

        }
    }

    return (
        <div className="wrapper">
            <div className="input-box">
                <div className="review-area">
                    <img src={"https://pbs.twimg.com/profile_images/1082374462559977481/v722bg9d_normal.jpg"} alt="" className="avator" />
                    <span className="input" {
                        ...{
                            contentEditable: token.length !== 0
                        }
                    } onKeyUp={
                        (e) => {
                            setText(e.target.textContent);
                        }
                    } >{
                            token.length !== 0 ? "" : "Please authorize to send a review"
                        }</span>
                </div>
            </div>
            <div className="bottom">
                <span className="counter" style={{
                    display: text.length == 0 ? "none" : "inherit"
                }}>{
                        1000 - text.length
                    }</span>
                <button onClick={handleClick}
                    {
                    ...{
                        disabled: text.length === 0 && (token.length !== 0)
                    }
                    }>{
                        token.length !== 0 ? "Review" : "Authorize with twitter"
                    }</button>
            </div>
        </div>

    )
}
