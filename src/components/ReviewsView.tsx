const { React } = window;
import { find, findByCode, waitFor } from "../webpack/webpack"
import Review from "./Review";

let Tweet;
waitFor(m=>m.displayName === "Tweet",(m) => {
  console.log("loading tweet",m)
  // if user directly opens /gamers because tweet is not loaded this will never fire
  Tweet = m;
})


export default function ReviewsView() {
  if (!Tweet) {
    return <div>loading</div>
  }

  let tweet = new Tweet(GetProps(), {
    featureSwitches: {
      isTrue: () => false,
    }
  })
  console.log("tweet",tweet)

  return (
    <div>
       <Review/>
    </div>
  )
}



function GetProps(): any {
  return {
    "contextualClientEventInfo": {
      "component": "suggest_undefined",
      "element": "tweet",
      "entityToken": "test_EntityTokenForYou",
      "details": "{timelinesDetails: {…}}"
    },
    "conversationPosition": {
      "isStart": true,
      "isEnd": false,
      "position": "descendant",
      "showReplyContext": true
    },
    "displayBlocked": false,
    "enableKeyboardShortcuts": false,
    "hideConversationControlsEducationText": false,
    "hideExclusivityInfoEducationTextInReplies": false,
    "hideTrustedFriendsEducationTextInReplies": false,
    "injectedFeedbackItem": {},
    "linkify": true,
    "viewerUser": {
      "can_dm": false,
      "can_media_tag": false,
      "default_profile": true,
      "default_profile_image": false,
      "description": "morbius",
      "entities": "{description: {…}}",
      "fast_followers_count": 0,
      "favourites_count": 2615,
      "followers_count": 14,
      "friends_count": 79,
      "has_custom_timelines": false,
      "is_translator": false,
      "listed_count": 0,
      "location": "null",
      "media_count": 9,
      "name": "mantikafasi",
      "needs_phone_verification": false,
      "normal_followers_count": 14,
      "pinned_tweet_ids_str": "[]",
      "possibly_sensitive": false,
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/1082374462559977481/v722bg9d_normal.jpg",
      "profile_interstitial_type": "",
      "screen_name": "mantikafasi1",
      "statuses_count": 491,
      "translator_type": "none",
      "verified": false,
      "want_retweets": false,
      "withheld_in_countries": "[]",
      "id_str": "1001497223329402880",
      "is_profile_translatable": false,
      "profile_image_shape": "Circle",
      "is_blue_verified": false,
      "has_graduated_access": true,
      "created_at": "2018-05-29T16:15:19.000Z",
      "blocked_by": false,
      "muting": false,
      "blocking": false,
      "id": 1001497223329402900,
      "url": null,
      "protected": false,
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": false,
      "lang": null,
      "contributors_enabled": false,
      "is_translation_enabled": false,
      "profile_background_color": "F5F8FA",
      "profile_background_image_url": null,
      "profile_background_image_url_https": null,
      "profile_background_tile": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/1082374462559977481/v722bg9d_normal.jpg",
      "profile_link_color": "1DA1F2",
      "profile_sidebar_border_color": "C0DEED",
      "profile_sidebar_fill_color": "DDEEF6",
      "profile_text_color": "333333",
      "profile_use_background_image": true,
      "following": false,
      "follow_request_sent": false,
      "notifications": null,
      "has_nft_avatar": false
    },
    "replyContext": "isolated",
    "shouldSelfThreadIncludeAvatar": true,
    "socialContext": {
      "contextType": "Conversation",
      "text": "Vee 🎀 replied",
      "landingUrl": "{url: \"twitter://user?id=1489450649150447618\", urlT…}"
    },
    "tweet": {
      "bookmark_count": 29,
      "bookmarked": false,
      "conversation_id_str": "1662171747313958923",
      "display_text_range": "[0, 71]",
      "entities": "{hashtags: Array(0), symbols: Array(0), urls: Array…}",
      "favorite_count": 1574,
      "favorited": false,
      "full_text": "We can tell you're afraid of change when your default browser is Chrome",
      "is_quote_status": false,
      "lang": "en",
      "quote_count": 103,
      "reply_count": 558,
      "retweet_count": 167,
      "retweeted": false,
      "id_str": "1662171747313958923",
      "edit_control": "{edit_tweet_ids: Array(1), editable_until_msecs: \"1…}",
      "edit_perspective": "{favorited: false, retweeted: false}",
      "is_translatable": false,
      "has_super_follower": false,
      "source": "<a href=\"https://prod1.sprinklr.com\" rel=\"nofollow\">Sprinklr Publishing</a>",
      "user": "{can_dm: false, can_media_tag: true, created_at: \"2…}",
      "views": "{count: 164250, state: \"EnabledWithCount\"}",
      "text": "We can tell you're afraid of change when your default browser is Chrome",
      "created_at": "2023-05-26T19:00:00.000Z",
      "source_name": "Sprinklr Publishing",
      "source_url": "https://prod1.sprinklr.com",
      "permalink": "/MicrosoftEdge/status/1662171747313958923"
    },
    "withActions": true,
    "withActionsDisabled": false,
    "withBirdwatchPivots": true,
    "withCardLinks": false,
    "withInlineMedia": true,
    "withQuotedTweetLinks": false,
    "withRemoveFromBookmarks": false,
    "withSelfThread": true,
    "withSocialContext": false,
    "withUserPresence": false,
    "isFocal": false,
    "isInEditHistory": false,
    "onAnalyticsClick": "ƒ () {}",
    "onAvatarClick": "ƒ () {}",
    "onBirdwatchNotesIconClick": "ƒ () {}",
    "onBirdwatchNotesIconShown": "ƒ () {}",
    "onBlur": "ƒ () {}",
    "onCardLinkClick": "ƒ () {}",
    "onClick": "ƒ () {}",
    "onEntityClick": "ƒ () {}",
    "onFocus": "ƒ () {}",
    "onFosnrAuthorLabelImpression": "ƒ () {}",
    "onFosnrAuthorAppealClick": "ƒ () {}",
    "onLikeSuccess": "ƒ () {}",
    "onMediaClick": "ƒ () {}",
    "onMediaHashtagHighlightClick": "ƒ () {}",
    "onModeratedIconClick": "ƒ () {}",
    "onModeratedIconShown": "ƒ () {}",
    "onPoliticalSponsorWebsiteClick": "ƒ () {}",
    "onPromoteButtonClick": "ƒ () {}",
    "onPromoteAgainButtonClick": "ƒ () {}",
    "onPromotedDisclaimerLearnMoreClick": "ƒ () {}",
    "onPromotedIndicatorClick": "ƒ () {}",
    "onPromotedUserProfileCardClick": "ƒ () {}",
    "onQuoteTweetClick": "ƒ () {}",
    "onReply": "ƒ () {}",
    "onReplyContextClick": "ƒ () {}",
    "onScreenNameClick": "ƒ () {}",
    "onSelfThreadClick": "ƒ () {}",
    "onSelfThreadImpression": "ƒ () {}",
    "onUndoTopicNotInterestedClick": "ƒ () {}",
    "onUserFollowIndicatorClick": "ƒ () {}",
    "onUserFollowIndicatorDismissClick": "ƒ () {}",
    "onUserFollowIndicatorLearnMoreClick": "ƒ () {}",
    "renderCurationActionMenu": "ƒ () {}",
    "saveAsRecentSearch": "ƒ () {}",
    "to": {
      "state": "{contextTweetId: \"1662171747313958923\", contextualC…}",
      "pathname": "/MicrosoftEdge/status/1662171747313958923"
    },
    "withAltTextBadge": true,
    "withAvatarLink": true,
    "withTimestampLink": true,
    "withUserHoverCard": true,
    "withUserAvatar": true,
    "withUserName": true,
    "withTimestamp": true
  }
}

