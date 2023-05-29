import { ReviewDBUser } from "./utils/entities";

declare global {
    export var React: typeof import("react");
    export var chrome;
    export var browser;
    export var Extension: {
        getToken(): Promise<any>;
        setToken(token: string): Promise<any>;
        authorize(): Promise<{ token: string; user: ReviewDBUser }>;
        getUser(): Promise<ReviewDBUser>;
    };
}

export {};
