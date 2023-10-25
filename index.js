// internal imports
import { tweetsData } from "/data.js"

// external imports
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// event listener for like, retweet, reply and tweet buttons
document.addEventListener("click", function(e){
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)

    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)

    } else if (e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)

    } else if (e.target.id === "tweet-btn")
        handleTweetBtnClick()

})

// function to handle like clicks
function handleLikeClick(tweetId){
   
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]// gives an array and saves item at position 0 to targetTweetObj

     // increment/decement likes count
    targetTweetObj.likes += (targetTweetObj.isLiked ? -1 : 1)

    // changes isLiked from true to false and vise versa
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    render()
}

// function to handle retweet clicks
function handleRetweetClick(tweetId){

    const targetRetweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    // increment/decrement retweet count
    targetRetweetObj.retweets += (targetRetweetObj.isRetweeted ? -1 : 1)

     // changes isRetweeted from true to false and vise versa
    targetRetweetObj.isRetweeted =! targetRetweetObj.isRetweeted
    
    render()
}

// function to handle reply clicks to hide/show replies
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// function to handle tweet button clicks
function handleTweetBtnClick(){

    const tweetInput = document.getElementById("tweet-input")

    // if there is text in the input area, post the tweet
    if (tweetInput.value.length > 0){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

        render()
        tweetInput.value =""

    // send an alert to user saying that tweet text area can't be empty
    } else {
        alert("Tweet cannot be empty!")
    }
}

// function to get Twimba feed
function getFeedHtml(){
    // initialize empty feed
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){

        // use classes to set color of likes and retweets
        const likeIconClass = tweet.isLiked ? "liked" : ""
        const retweetIconClass = tweet.isRetweeted ? "retweeted" : ""

        let repliesHtml =""

        // check tweets to see if they have replies
        if(tweet.replies.length > 0){
           tweet.replies.forEach(function(reply){
            repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
    `
    })
}

        // HTML for the feed
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
        <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>
`
    })
return feedHtml
}

// render the feed to the page
function render(){
    document.getElementById("feed").innerHTML = getFeedHtml()

}

render()