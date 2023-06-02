import { Auth } from "..";
import { Logger } from "../utils";
import { getReviews } from "../utils/ReviewDBAPI";
import { Review, ReviewDBUser } from "../utils/entities";
import { React } from "../webpack/common";
import Input from "./Input";
import ReviewComponent from "./ReviewComponent";
import Toast from "./Toast";
import "./common.css";

export default function ReviewsView(props: {
    location?: any; twitterId?: string;
}) {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const { toast } = require("react-toastify") as typeof import("react-toastify");
    const [user, setUser] = React.useState<ReviewDBUser | null>(null);

    /*
    let history = ReviewDB.Webpack.cache[81549].exports.Z
    let ctx = history();
    ctx.displayName = "Router-History"
    let realCtx = React.useContext(ctx)
    debugger
    console.log(realCtx) //undefined
    */


    if (!props.twitterId) {
        // if twitterId is not provided, get it from url which will be provided by openModal function
        props.twitterId = props.location.query.userId;
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
            marginBottom: "64px"
        }}>
            <Toast />

            <Input profileId={props.twitterId!} refetch={refetch} auth={authorize} user={user} />
            {reviews?.length !== 0 ? reviews?.map(review => <ReviewComponent review={review} user={user} refetch={refetch} />) : (
                <span className="nobody-reviewed-text">
                    Looks like nobody reviewed this user yet. Be the first one!
                </span>
            )}
        </div>
    );
}



