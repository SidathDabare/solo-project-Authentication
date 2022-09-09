/** @format */

import mongoose from "mongoose"

const { Schema, model } = mongoose

const AccomadationSchema = new Schema(
  {
    name: { type: String, required: true },
    maxGuest: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    //commentHistory: [{ comment: String, rate: Number, created_At: Date }],
  },
  {
    timestamps: true,
  }
)

export default model("Accomadation", AccomadationSchema)
