import "./webpack/patchWebpack";
import "./utils/cssVariables";
import "./components/index.css";

import { waitFor } from "./webpack/webpack";

export { React } from "./webpack/common";
export * as Webpack from "./webpack";
export * as Utils from "./utils";

import { Patcher } from "jsposed";
import ReviewsView from "./components/ReviewsView";
import { findInReactTree } from "./utils/tree";
import { EXTENSION_ID } from "./utils/constants";
import { ReviewDBUser } from "./utils/entities";
import { React } from "./webpack/common";
import { Logger } from "./utils/Logger";

export const patcher = new Patcher("ReviewDB");
export const logger = new Logger("Main");

const browser = chrome;

export const Auth = {
    authorize() {
        return new Promise<ReviewDBUser | null>(resolve => {
            browser.runtime.sendMessage(EXTENSION_ID, { type: "authorize" }, resolve);
        });
    },
    getUser() {
        return new Promise<ReviewDBUser>(resolve => {
            browser.runtime.sendMessage(EXTENSION_ID, { type: "getUser" }, resolve);
        });
    },
    fetch(url: string, responseType: string, options?: RequestInit) {
        return new Promise<{ status: number; text: string; json: any; ok: boolean }>(resolve => {
            browser.runtime.sendMessage(
                EXTENSION_ID,
                { type: "fetch", url, options, responseType },
                resolve
            );
        });
    },
};

waitFor("computeRootMatch", ReactRouter => {
    patcher.after(ReactRouter.prototype, "render", ctx => {
        let res = findInReactTree(
            ctx.result,
            m =>
                m?.props?.path?.includes("with_replies|") &&
                !m.props.path.includes("with_replies|reviews") // to make sure it doesnt add multiple times
        );
        if (!res) return;
        // here I add my custom route to the array so whenever you call /reviews it will open twitter user's profile component, later we patch the profile component to show reviews
        res.props.path = res.props.path.replace("with_replies|", "with_replies|reviews|");
    });
});

waitFor(
    m => m.prototype?.render?.toString().includes("props.from"),
    Route => {
        patcher.before(Route.prototype, "render", ctx => {
            const { location, children } = ctx.thisObject.props;

            if (location) return;
            if (!children.some(c => c?.props?.path?.endsWith("/media"))) return;

            let kid = ctx.thisObject.props.children[0];
            const { userId } = findInReactTree(ctx.thisObject, m => m?.userId);

            ctx.thisObject.props.children.unshift(
                React.cloneElement(
                    kid,
                    {
                        path: "/:screenName([a-zA-Z0-9_]{1,20})/reviews",
                        props: {
                            path: "/:screenName([a-zA-Z0-9_]{1,20})/reviews",
                        },
                    },
                    React.createElement(ReviewsView, { twitterId: userId }, "Reviews")
                )
            );
        });
    }
);

waitFor("getDerivedStateFromError", m => {
    patcher.instead(m.prototype, "componentDidCatch", ctx => {
        // normally twitters error boundary would hide the error from console and send it to their api
        // this shows the error on console and prevents it from being sent to their api
        logger.error("reviewdb or twitter shitted itself", ctx.args[0], ctx.args[1]);
    });
});

waitFor(
    m => m.prototype?._renderLinks,
    Links => {
        patcher.after(Links.prototype, "render", ctx => {
            if (!ctx.result?.key?.includes("Tweets-")) return;

            let kid = ctx.result.props.children[0];
            const pathName = kid.props.to.pathname;

            let newPath = "/" + pathName.substr(pathName.lastIndexOf("/") + 1);
            ctx.result.props.children.push(
                React.cloneElement(kid, {
                    key: "reviews",
                    isActive: () => document.location.pathname.endsWith("/reviews"),
                    viewType: "reviews",
                    to: {
                        pathname: newPath + "/reviews",
                        query: {},
                    },
                    children: "Reviews",
                    color: "primary",
                    retainScrollPosition: true,
                })
            );
        });
    }
);
