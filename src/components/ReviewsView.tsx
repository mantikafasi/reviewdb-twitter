import { getReviews } from "../utils/ReviewDBAPI";
import { Review } from "../utils/entities";
import Input from "./Input";
import ReviewComponent from "./ReviewComponent";

export default function ReviewsView(props: { twitterId: string; }) {
    const [reviews, setReviews] = React.useState<Review[]>([]);

    React.useEffect(() => {
        getReviews(props.twitterId).then(reviews => setReviews(reviews));
    }, ["userid"]);
    return (
        <div style={{
            marginBottom: "100px"
        }}>
            <Input />
            {reviews &&
                reviews.map(review => <ReviewComponent review={review} />)
            }
        </div>
    );
}



