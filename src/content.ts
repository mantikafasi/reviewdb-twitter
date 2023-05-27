import "./webpack/patchWebpack";

import { awaitModule, find, findByProps, waitFor } from "./webpack/webpack";
import { Patcher } from "jsposed";
import ReviewsView from "./components/ReviewsView";
const patcher = new Patcher();

// ik this is terrible once I get it to work I will replace with saner search
waitFor(m => m?.rs,(m)=>{
  const React = findByProps("useState");
  window.React = React;

  // F0 is React Router
  // EN is withRouter
  // AW is possibly <Route>
  patcher.after(m.F0.prototype,"render", (ctx) => {

    ctx.result.props.children.props.children.props.children.props.children[1].props.children.props.children.props.children.forEach(element => {
      if (Array.isArray(element)) {
        element.forEach(element2 => {

          if (element2?.key === "profile") {
            if (!element2.props.path.includes("with_replies|gamers")) {
              element2.props.path = element2.props.path.replace("with_replies|", "with_replies|gamers|");

              // here I add my custom route to the array so whenever you call /reviews it will open twitter user's profile
              console.log("added custom route",element2);
            }
          }
        });
      }
    });
    console.log("route", ctx.result);
  });

  patcher.before(m.rs.prototype, "render", (ctx)=>{

    if (ctx.thisObject.props.children.length === 12 ) {
      let kid = ctx.thisObject.props.children[0];

      ctx.thisObject.props.children.unshift(
        React.cloneElement(kid, {
            path:"/:screenName([a-zA-Z0-9_]{1,20})/gamers",
            props: {

              path:"/:screenName([a-zA-Z0-9_]{1,20})/gamers",
            },
        }, React.createElement(ReviewsView, {style: {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "white", fontSize: "40px"}}, "Gamers")  )
      );
    }
  })
})

waitFor(m => m.toString().includes("getDerivedStateFromError"), (m) => {
  patcher.instead(m.prototype, "componentDidCatch", (ctx) => {
    console.error("deranged twitter error boundry", ctx.args[0], ctx.args[1]);
  })
})

awaitModule("getState").then(R => {
  const React = findByProps("useState");

  waitFor(m => m?.Z?.prototype?.render?.toString().includes("childrenStyle:w.flexGrow"),(m)=>{
    console.log("linkModule loaded", m);

    patcher.after(m.Z.prototype,"render", (ctx) => {

      let kid = ctx.result.props.children[0];
      ctx.result.props.children.push(
        React.cloneElement(kid, {
          "key":"gamers",
          isActive: () => document.location.pathname.endsWith("/gamers"),
          "viewType": "gamers",
          "to": {
              "pathname": "/TheVendyMachine/gamers", // TODO make this dynamic
              "query": {}
          },
          "children": "Gamers",
          "color": "primary",
          "retainScrollPosition": true
      })
      )
      console.log("linkModule", ctx.result);
    })
  })

  console.log("content loaded");
});
