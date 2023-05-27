import { getReviews } from "../utils/ReviewDBAPI";
import { Review } from "../utils/entities";
import ReviewComponent from "./ReviewComponent";

export default function ReviewsView() {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    getReviews("287555395151593473").then(reviews=>setReviews(reviews));
  })
  return (
    <div style={{
      marginBottom: 60
    }}>
      { reviews&&
        reviews.map(review => <ReviewComponent review={review} />)
      }
    </div>
  )
}



