import { waitFor } from "./webpack";

export let React: typeof import("react");

waitFor(["useState", "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"], m => (React = m));
