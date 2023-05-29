import { getReviews } from "../utils/ReviewDBAPI";
import { Review } from "../utils/entities";
import Input from "./Input";
import ReviewComponent from "./ReviewComponent";

export default function ReviewsView(props: { twitterId: string; }) {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [count, setCount] = React.useState<number>(0);
    function refetch() {
        setCount(count + 1);
    }
    React.useEffect(() => {
        getReviews(props.twitterId).then(reviews => setReviews(reviews));
    }, [props.twitterId,count]);
    return (
        <div style={{
            marginBottom: "100px"
        }}>
            <Input profileId={props.twitterId} refetch={refetch}/>
            {reviews &&
                reviews.map(review => <ReviewComponent review={review} />)
            }
        </div>
    );
}



