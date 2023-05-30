import "./webpack/patchWebpack";

import { waitFor } from "./webpack/webpack";

export * as Webpack from "./webpack";
export * as Utils from "./utils";

import { Patcher } from "jsposed";
import ReviewsView from "./components/ReviewsView";
import { findInReactTree } from "./utils/tree";
import { EXTENSION_ID } from "./utils/constants";
import { ReviewDBUser } from "./utils/entities";

export const patcher = new Patcher();

const browser = chrome;

export const Auth = {
    getToken() {
        return new Promise<string | null>(resolve => {
            browser.runtime.sendMessage(EXTENSION_ID, { type: "getToken" }, resolve);
        });
    },
    setToken(token: string) {
        return new Promise<void>(resolve => {
            browser.runtime.sendMessage(EXTENSION_ID, { type: "setToken", token }, resolve);
        });
    },
    authorize() {
        return new Promise<{ token: string; user: ReviewDBUser } | null>(resolve => {
            browser.runtime.sendMessage(EXTENSION_ID, { type: "authorize" }, resolve);
        });
    },
    getUser() {
        return new Promise<ReviewDBUser>(resolve => {
            browser.runtime.sendMessage(EXTENSION_ID, { type: "getUser" }, resolve);
        });
    },
};

// declare react as global variable, later extension will use it to create components
waitFor("useState", React => (window.React = React));

// ik this is terrible once I get it to work I will replace with saner search
waitFor(
    m => m?.rs,
    m => {
        // F0 is React Router
        // EN is withRouter
        // AW is possibly <Route>
        patcher.after(m.F0.prototype, "render", ctx => {
            let res = findInReactTree(
                ctx.result,
                m =>
                    m?.props?.path?.includes("with_replies|") &&
                    !m.props.path.includes("with_replies|gamers") // to make sure it doesnt add multiple times
            );
            if (!res) return;
            // here I add my custom route to the array so whenever you call /reviews it will open twitter user's profile component, later we patch the profile component to show reviews
            res.props.path = res.props.path.replace("with_replies|", "with_replies|gamers|");
        });

        patcher.before(m.rs.prototype, "render", ctx => {
            if (ctx.thisObject.props.children.length === 12) {
                // this is terrible way to check but fine for now imo
                let kid = ctx.thisObject.props.children[0];
                const { userId } = findInReactTree(ctx.thisObject, m => m?.userId);

                ctx.thisObject.props.children.unshift(
                    React.cloneElement(
                        kid,
                        {
                            path: "/:screenName([a-zA-Z0-9_]{1,20})/gamers",
                            props: {
                                path: "/:screenName([a-zA-Z0-9_]{1,20})/gamers",
                            },
                        },
                        React.createElement(ReviewsView, { twitterId: userId }, "Gamers")
                    )
                );
            }
        });
    }
);

waitFor(
    m => m?.toString().includes("getDerivedStateFromError"),
    m => {
        patcher.instead(m.prototype, "componentDidCatch", ctx => {
            // normally twitters error boundary would hide the error from console and send it to their api
            // this shows the error on console and prevents it from being sent to their api
            console.error("reviewdb or twitter shitted itself", ctx.args[0], ctx.args[1]);
        });
    }
);

waitFor(
    m => m?.Z?.prototype?.render?.toString().includes("childrenStyle:w.flexGrow"),
    m => {
        patcher.after(m.Z.prototype, "render", ctx => {
            let kid = ctx.result.props.children[0];
            const pathName = kid.props.to.pathname;

            let newPath = "/" + pathName.substr(pathName.lastIndexOf("/") + 1);
            ctx.result.props.children.push(
                React.cloneElement(kid, {
                    key: "gamers",
                    isActive: () => document.location.pathname.endsWith("/gamers"),
                    viewType: "gamers",
                    to: {
                        pathname: newPath + "/gamers",
                        query: {},
                    },
                    children: "Gamers",
                    color: "primary",
                    retainScrollPosition: true,
                })
            );
        });
    }
);
