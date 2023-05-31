import "./Input.css";
import "./Reviews.css";
import 'react-toastify/dist/ReactToastify.css';

import { addReview } from "../utils/ReviewDBAPI";
import { ReviewDBUser } from "../utils/entities";

type Props = {
    refetch: () => void;
    profileId: string;
    user: ReviewDBUser | null;
    auth: () => void;
};

export default function Input({ refetch, profileId, user, auth }: Props) {
    const [text, setText] = React.useState<string>("");
    let inputRef = React.useRef<HTMLSpanElement>(null);
    const isAuthorized = () => !!user?.token;
    const { toast } = require("react-toastify") as typeof import("react-toastify");

    function handleClick(s: any) { // any because React.MouseEvent<HTMLButtonElement, MouseEvent> raises error
        if (isAuthorized()) {
            addReview({
                comment: text,
                profileId: profileId,
            },).then((res) => {
                if (res!.ok) {
                    toast.success(res!.text);
                    refetch();
                } else {
                    toast.error(res!.text ?? "An error occured while sending review");
                }

                setText("");
                inputRef?.current && (inputRef.current.innerHTML = "");
            });
        } else {
            auth();
            s.target.textContent = "Authorizing...";
        }
    }

    return (
        <div className="wrapper">
            <div className="input-box">
                <div className="review-area">
                    <a target="_blank" href={"https://twitter.com/" + user?.username}>
                        <img
                            src={user?.avatarURL || "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"}
                            alt=""
                            className="avator"
                        />
                    </a>

                    <span
                        ref={inputRef}
                        className="input"
                        contentEditable={isAuthorized()}
                        onKeyUp={(e: any /* whoever wrote typings for this should explode */) => {
                            setText(e.target.textContent);
                        }}>
                        {isAuthorized() ? "" : "Please authorize to send a review"}
                    </span>
                </div>
            </div>
            <div className="bottom">
                <span className="counter" style={{
                    display: text.length == 0 ? "none" : "inherit"
                }}>
                    {1000 - text.length}
                </span>
                <button
                    onClick={handleClick}
                    disabled={(text.length === 0 && isAuthorized()) || text.length > 1000}
                >
                    {isAuthorized() ? "Review" : "Authorize with twitter"}
                </button>
            </div>
        </div>

    );
}
