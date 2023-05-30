import { addReview } from "../utils/ReviewDBAPI";
import { ReviewDBUser } from "../utils/entities";
import "./Input.css";
import "./Reviews.css";
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    refetch: () => void;
    profileId: string;
};

export default function Input({ refetch, profileId }: Props) {

    const [text, setText] = React.useState<string>("");
    const [user, setUser] = React.useState<ReviewDBUser | null>(null);
    let inputRef = React.useRef<HTMLSpanElement>(null);
    const isAuthorized = () => !!user?.token;
    const { toast } = require("react-toastify") as typeof import("react-toastify");

    React.useEffect(() => {
        ReviewDB.Auth.getUser().then((user) => {
            user && setUser(user);
        });
    }, []);

    function handleClick(s: any) { // any because React.MouseEvent<HTMLButtonElement, MouseEvent> raises error
        if (isAuthorized()) {
            addReview(
                {
                    comment: text,
                    profileId: profileId,
                }, user!.token
            ).then((res) => {
                if (res.ok) {
                    toast.success(res.text);
                    refetch();
                } else {
                    toast.error(res.text ?? "An error occured while sending review");
                }
                setText("");
                inputRef?.current && (inputRef.current.innerHTML = "");
            });
        } else {
            open("https://twitter.com/i/oauth2/authorize?response_type=code&client_id=SFVDakw2VVg3V2VrTVlNVkNTS0Y6MTpjaQ&redirect_uri=https://manti.vendicated.dev/api/reviewdb-twitter/auth&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain");
            ReviewDB.Auth.authorize().then((res) => {
                if (res?.user?.token) {
                    setUser(res.user);
                } else {
                    s.target.textContent = "An error occured while authorizing please try again later";
                }
                s.target.textContent = "Review";
            });
            s.target.textContent = "Authorizing...";
        }
    }

    return (
        <div className="wrapper">
            <div className="input-box">
                <div className="review-area">
                    <img src={user ? user.avatar_url : "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"} alt="" className="avator" />
                    <span className="input" ref={inputRef} {
                        ...{
                            contentEditable: isAuthorized(),
                        }
                    } onKeyUp={
                        (e: any /* whoever wrote typings for this should explode */) => {
                            setText(e.target.textContent);
                        }
                    } >{
                            isAuthorized() ? "" : "Please authorize to send a review"
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
                        disabled: (text.length === 0 && isAuthorized()) || text.length > 1000,
                    }
                    }>{
                        isAuthorized() ? "Review" : "Authorize with twitter"
                    }</button>
            </div>
        </div>

    );
}
