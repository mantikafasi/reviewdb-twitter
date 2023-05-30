import { deleteReview, reportReview } from '../utils/ReviewDBAPI';
import { Review, ReviewDBUser } from '../utils/entities';
import Menu from './Menu';
import './Reviews.css';

export default function ReviewComponent(props: { review: Review; user: ReviewDBUser | null }) {
    const { toast } = require("react-toastify") as typeof import("react-toastify");

    const deleteRev = () => {
        deleteReview(props.review.id).then(res => {
            if (res.ok) {
                toast.success(res.text);
            } else {
                toast.error(res.text ?? "An error occured while deleting review");
            }
        }
        );
    };

    const reportRev = () => {
        if (!props.user) {
            toast.error("You must be logged in to report a review");
            return;
        }

        reportReview(props.review.id).then(res => {
            if (res.ok) {
                toast.success(res.text);
            } else {
                toast.error(res.text ?? "An error occured while reporting review");
            }
        }
        );
    };

    return (
        <div className="review-header">
            <a target='_blank' href={'https://twitter.com/' + props.review.sender.username}>
                <img src={props.review.sender.avatarURL} alt="" className="avator" />
            </a>
            <div className="review-header-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div>
                        <a target="_blank" href={'https://twitter.com/' + props.review.sender.username}>{props.review.sender.displayName}</a>  <span>{props.review.sender.username}</span><span> {new Date(props.review.timestamp * 1000).toLocaleString()}
                        </span>
                    </div>
                    <Menu options={
                        [
                            {
                                text: "Report Review",
                                onClick: () => reportRev,
                                iconType: "report",
                            },
                            {
                                text: "Delete Review",
                                onClick: () => deleteRev,
                                iconType: "delete",
                            },
                        ]
                    } />
                </div>

                <p>{props.review.comment}</p>
            </div>
        </div>
    );
}
