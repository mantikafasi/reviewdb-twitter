import { Auth, ReactRouter } from "..";
import { Logger } from "../utils";
import { getReviews } from "../utils/ReviewDBAPI";
import { Review, ReviewDBUser } from "../utils/entities";
import { React } from "../webpack/common";
import Input from "./Input";
import ReviewComponent from "./ReviewComponent";
import Toast from "./Toast";

export default function ReviewsView(props: { twitterId?: string; }) {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const { toast } = require("react-toastify") as typeof import("react-toastify");
    const [user, setUser] = React.useState<ReviewDBUser | null>(null);

    if (!props.twitterId) {
        // if twitterId is not provided, get it from url which will be provided by openModal function
        props.twitterId = ReactRouter.useParams().twitterId;
    }

    function refetch() {
        setCount(count + 1);
    }

    React.useEffect(() => {
        Auth.getUser().then((user) => {
            user && setUser(user);
        });
    }, []);

    React.useEffect(() => {
        getReviews(props.twitterId!).then(reviews => setReviews(reviews)).catch(err => {
            toast.error("An error occured while fetching reviews");
            new Logger("ReviewsView").error(err);
        });
    }, [props.twitterId, count]);

    function authorize() {
        Auth.authorize().then((user) => {
            if (!user) {
                toast.error("An error occured while authorizing");
                return;
            }
            setUser(user);
            toast.success("Authorized successfully");
        });
    }

    return (
        <div style={{
            marginBottom: "100px"
        }}>
            <Toast />

            <Input profileId={props.twitterId!} refetch={refetch} auth={authorize} user={user} />
            {reviews?.map(review => <ReviewComponent review={review} user={user} refetch={refetch} />)}
        </div>
    );
}



