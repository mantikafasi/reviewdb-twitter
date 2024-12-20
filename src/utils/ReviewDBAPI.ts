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

import { Auth } from "..";
import { Review, ReviewDBUser } from "./entities";

const API_URL = "https://manti.vendicated.dev";

interface Response {
    success: boolean;
    message: string;
    reviews: Review[];
    updated: boolean;
}

const WarningFlag = 0b00000010;

export function getUser(): Promise<ReviewDBUser> {
    return Auth.getUser();
}

export async function getReviews(id: string): Promise<Review[]> {
    var flags = 0;
    //if (!Settings.plugins.ReviewDB.showWarning) flags |= WarningFlag;
    const res = await Auth.fetch(
        API_URL + `/api/reviewdb-twitter/users/${id}/reviews?flags=${flags}`,
        "json"
    );

    if (res.status !== 200) {
        return [
            {
                id: 0,
                comment:
                    "An Error occured while ReviewDB.Auth.fetching reviews. Please try again later.",
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
    return res.json.reviews;
}

export async function addReview(reviewData: any) {
    let user = await getUser();
    if (!user) return;

    return Auth.fetch(
        API_URL + `/api/reviewdb-twitter/users/${reviewData.profileId}/reviews`,
        "text",
        {
            method: "PUT",
            body: JSON.stringify({ comment: reviewData.comment }),
            headers: {
                Authorization: user.token,
                "Content-Type": "application/json",
            },
        }
    );
}

export async function deleteReview(id: number) {
    let user = await getUser();

    return Auth.fetch(API_URL + `/api/reviewdb-twitter/users/${id}/reviews`, "text", {
        method: "DELETE",
        headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            reviewid: id,
        }),
    });
}

export async function reportReview(id: number) {
    let user = await getUser();

    return Auth.fetch(API_URL + "/api/reviewdb-twitter/reports", "text", {
        method: "PUT",
        headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            reviewid: id,
        }),
    });
}

export async function getCurrentUserInfo(token: string): Promise<ReviewDBUser | undefined> {
    let user = await getUser();
    if (!user) return;

    return Auth.fetch(API_URL + "/api/reviewdb-twitter/users", "json", {
        body: JSON.stringify({ token }),
        method: "POST",
    }).then(r => r.json);
}
