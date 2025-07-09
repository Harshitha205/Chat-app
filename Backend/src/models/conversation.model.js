// src/models/conversation.model.js

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // This references your User model
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message", // This references your Message model
                default: [],
            },
        ],
    },
    // `timestamps: true` will automatically add `createdAt` and `updatedAt` fields
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;