/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

export const enum UserType {
    Banned = -1,
    Normal = 0,
    Admin = 1,
}

export const enum ReviewType {
    User = 0,
    Server = 1,
    Support = 2,
    System = 3,
}

export interface Badge {
    name: string;
    description: string;
    icon: string;
    redirectURL: string;
    type: number;
}

export interface BanInfo {
    id: string;
    discordID: string;
    reviewID: number;
    reviewContent: string;
    banEndDate: number;
}

export interface ReviewDBUser {
    ID: number;
    twitterId: string;
    username: string;
    displayName: string;
    avatarURL: string;
    token: string;
    warningCount: number;
    badges: any[];
    banInfo: BanInfo | null;
    lastReviewID: number;
    type: UserType;
}

export interface ReviewAuthor {
    id: number;
    twitterId: string;
    username: string;
    avatarURL: string;
    displayName: string;
    badges: Badge[];
}

export interface Review {
    comment: string;
    id: number;
    sender: ReviewAuthor;
    timestamp: number;
    type?: ReviewType;
}
