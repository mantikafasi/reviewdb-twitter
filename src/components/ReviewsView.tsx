import { getReviews } from "../utils/ReviewDBAPI";
import { Review } from "../utils/entities";
import Input from "./Input";
import ReviewComponent from "./ReviewComponent";
import Toast from "./Toast";

export default function ReviewsView(props: { twitterId: string; }) {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const { toast } = require("react-toastify") as typeof import("react-toastify");

    function refetch() {
        setCount(count + 1);
    }

    React.useEffect(() => {
        getReviews(props.twitterId).then(reviews => setReviews(reviews)).catch(err => {
            toast.error("An error occured while fetching reviews");
            console.error(err);
        });
    }, [props.twitterId, count]);

    return (
        <div style={{
            marginBottom: "100px"
        }}>
            <Toast />

            <Input profileId={props.twitterId} refetch={refetch} />
            {reviews &&
                reviews.map(review => <ReviewComponent review={review} />)
            }
        </div>
    );
}



