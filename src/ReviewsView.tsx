import { find, waitFor } from "./webpack/webpack"

waitFor(m=>m.displayName === "Tweet",(m) => {

})

console.log(find(m=>m.displayName === "Tweet"))
export default function ReviewsView() {
  return (
    <div>

    </div>
  )
}
