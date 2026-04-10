import { logger, React } from "..";
import { filters, mapMangledModule, waitFor } from "../webpack";
const hooksPattern = /return\s\w+\(\w+\)/;
const locationPattern = /return\s\w+\(\w+\)\.location/;

export let ReactRouter = {} as {
    useHistory: () => any;
    useLocation: () => any;
    useParams: () => any;
};

waitFor(filters.byProps("useHistory"), (Module, id) => {
    ReactRouter = Module;

    // ReactRouter = mapMangledModule(id, {
    //     useHistory: m => m?.toString().match(hooksPattern),
    //     useLocation: m => m?.toString().match(locationPattern), // this works in console but not in code TERRIBLE
    //     useParams: filters.byCode(".match", ".params"),
    // });
});
