import "./webpack/patchWebpack";

import { after, before } from "spitroast";
import { awaitModule, find, findByProps, waitFor } from "./webpack/webpack";
import { Patcher } from "jsposed";
const patcher = new Patcher();

awaitModule("getState").then(React => {
  let module = find(m => m?.rs);
  // ik this is terrible once I get it to work I will replace with saner search
  let module3 = findByProps("resetIsModalScrollerRendered");
  let tweetsModule = find(m => m?.Z?.WrappedComponent?.prototype?.render?.toString().includes("isRestrictedSession:e"));
  let linkModule = find(m => m?.Z?.prototype?.render?.toString().includes("childrenStyle:w.flexGrow"));
  let contentModuke = findByProps("nO");

  /* this module is lazy loaded
  before("render", linkModule.Z.prototype, (args) =>{
    console.log("render2", linkModule.Z.prototype);
  })
  */
  waitFor(m => m?.Z?.prototype?.render?.toString().includes("childrenStyle:w.flexGrow"),(m)=>{
    console.log("linkModule loaded", m);

    /*
    patcher.after("render", m.Z.prototype, (ctx,ctx2) =>{

      console.log("linkModule", ctx.thisObject,ctx2);
    })
    */

    after("render", m.Z.prototype, (args, response) => {
      console.log("linkModule", response);
    })
  })

  after("render", module.AW.prototype, (args, response) => {
    console.log("awk", response);
    if (response?.children?.length == 11) {
      console.log("found <Route>", response);
    }
  });

  after("render", contentModuke.nO.prototype, (args, response) => {
    console.log("content", response);

    if (response?._owner?.memoizedProps?.namespace && response._owner.memoizedProps.namespace.page == 'profile') {
      console.log("found profile", response._owner.memoizedProps.namespace);
    }

    if (response?._owner?.memoizedProps?.namespace && response._owner.memoizedProps.namespace.page == 'profile' && response._owner.memoizedProps.section == 'gamers') {
      console.log("found gamers");
      response.children = React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" } }, "Gamers");
      return response;
    }
  });

  after("render", tweetsModule.Z.WrappedComponent.prototype, (args, response) => {
    console.log("render", tweetsModule.Z.WrappedComponent.prototype);
    console.log(response);
    /*
    if (document.URL.includes("gamers")) {
      return React.createElement("div", {style: {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%"}}, "Gamers");
    }
    */
  });

  // F0 is React Router
  // EN is withRouter
  // AW is possibly <Route>
  after("render", module.F0.prototype, (args, response) => {

    response.props.children.props.children.props.children.props.children[1].props.children.props.children.props.children.forEach(element => {
      if (Array.isArray(element)) {
        element.forEach(element2 => {

          if (element2?.key?.includes("(likes|media")) {
            element2.key = "(likes|media|gamers)";
            element2.props.path = element2.props.path.replace("(likes|media)", "(likes|media|gamers)");
            //element2.props.component = React.createElement("div", {style: {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%"}}, "Gamers");

            // here I add my custom route to the array so whenever you call /reviews it will open twitter user's profile
            console.log(element2);
            console.log("added custom route");
          }
        });
      } else {
        //console.log("found route", element?.key);
      }
    });
  });

  /*
  after("render", module2, (args, response)  =>{
    console.log("render2", args);
    console.log(response);
  })
  */
  console.log("content loaded");
});
