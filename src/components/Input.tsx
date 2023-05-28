import "./Input.css";
import "./Reviews.css";
type Props = {}

export default function Input({ }: Props) {
    const [text, setText] = React.useState<string>("");

    function sendReview() {

    }

    return (
        <div className="wrapper">
            <div className="input-box">
                <div className="review-area">
                    <img src={"https://pbs.twimg.com/profile_images/1082374462559977481/v722bg9d_normal.jpg"} alt="" className="avator" />
                    <span className="input" contentEditable onKeyUp={
                        (e) => {
                            setText(e.target.textContent);
                        }
                    } />
                </div>
            </div>
            <div className="bottom">
                <span className="counter" style={{
                    display: text.length == 0 ? "none" : "inherit"
                }}>{
                        1000 - text.length
                    }</span>
                <button onClick={sendReview}
                    {
                    ...{
                        disabled: text.length === 0
                    }
                    }>Review</button>
            </div>
        </div>

    )
}
