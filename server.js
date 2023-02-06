/** @format */

import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"

import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedErrorHandler,
} from "./src/errorHandlers.js"

import usersRouter from "./src/api/users/index.js"
import accomadationRouter from "./src/api/accomadation/index.js"
import dotenv from "dotenv"

const server = express()
const port = process.env.PORT || 3001
dotenv.config()

server.use(cors())
server.use(express.json())

server.use("/accomadation", accomadationRouter)
server.use("/users", usersRouter)

server.use(unauthorizedErrorHandler)
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
