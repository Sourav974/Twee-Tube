import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  const tweet = await Tweet.create({ content });

  res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet succesffuly created!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  console.log("userId", userId);

  const tweet = await Tweet.findById(userId);

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Successfully fetched tweet!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const content = req.body;

  const tweet = await Tweet.findByIdAndUpdate(
    {
        tweetId,
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet has been successfully updated!"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
