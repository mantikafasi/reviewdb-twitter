/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Review, ReviewDBUser } from "./entities";

const API_URL = "https://manti.vendicated.dev";

const getToken = () => "";

interface Response {
    success: boolean;
    message: string;
    reviews: Review[];
    updated: boolean;
}

const WarningFlag = 0b00000010;

export async function getReviews(id: string): Promise<Review[]> {
    var flags = 0;
    //if (!Settings.plugins.ReviewDB.showWarning) flags |= WarningFlag;
    const req = await fetch(API_URL + `/api/reviewdb-twitter/users/${id}/reviews?flags=${flags}`);

    const res = (await req.json()) as Response;

    if (req.status !== 200) {
        //showToast(res.message);
        return [
            {
                id: 0,
                comment: "An Error occured while fetching reviews. Please try again later.",
                timestamp: 0,
                sender: {
                    id: 0,
                    username: "Error",
                    displayName: "Error",
                    avatarURL:
                        "https://cdn.discordapp.com/attachments/1045394533384462377/1084900598035513447/646808599204593683.png?size=128",
                    twitterId: "0",
                    badges: [],
                },
            },
        ];
    }
    return res.reviews;
}

export async function addReview(review: any): Promise<Response | null> {
    review.token = getToken();

    if (!review.token) {
        //showToast("Please authorize to add a review.");
        //authorize();
        return null;
    }

    return fetch(API_URL + `/api/reviewdb-twitter/users/${review.userid}/reviews`, {
        method: "PUT",
        body: JSON.stringify(review),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(r => r.json())
        .then(res => {
            //showToast(res.message);
            return res ?? null;
        });
}

export function deleteReview(id: number): Promise<Response> {
    return fetch(API_URL + `/api/reviewdb-twitter/users/${id}/reviews`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
        body: JSON.stringify({
            token: getToken(),
            reviewid: id,
        }),
    }).then(r => r.json());
}

export async function reportReview(id: number) {
    const res = (await fetch(API_URL + "/api/reviewdb-twitter/reports", {
        method: "PUT",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
        body: JSON.stringify({
            reviewid: id,
            token: getToken(),
        }),
    }).then(r => r.json())) as Response;
    //showToast(await res.message);
}

export function getCurrentUserInfo(token: string): Promise<ReviewDBUser> {
    return fetch(API_URL + "/api/reviewdb-twitter/users", {
        body: JSON.stringify({ token }),
        method: "POST",
    }).then(r => r.json());
}
