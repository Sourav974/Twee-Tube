import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  const videoFileLocalPath = req.files?.videoFile?.[0]?.destination
    ? `${req.files.videoFile[0].destination}/${req.files.videoFile[0].originalname}`
    : null;

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.destination
    ? `${req.files.thumbnail[0].destination}/${req.files.thumbnail[0].originalname}`
    : null;

  // Validate required files
  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  // Upload files to Cloudinary
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  // Create video entry
  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
  });

  res
    .status(201)
    .json(new ApiResponse(201, video, "Video is succesffuly published"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  const video = await Video.findById(videoId);

  res.status(200).json(new ApiResponse(200, video, "Success"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  console.log(title, description, videoId);

  //TODO: update video details like title, description, thumbnail

  const thumbnailLocalPath = req.file?.destination
    ? `${req.file.destination}/${req.file.originalname}`
    : null;

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated succesffuly"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO: delete video
  const video = await Video.findByIdAndDelete(videoId);

  res.status(204).json(new ApiResponse(204));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  video.isPublished = !video.isPublished;

  await video.save();

  res
    .status(201)
    .json(new ApiResponse(201, video, "Publish status updated succesffuly"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
