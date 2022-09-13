/** @format */

import express from "express"
import createHttpError from "http-errors"
import AccomadationModel from "./model.js"
import { JWTAuthMiddleware } from "../../lib/auth/token.js"
import { hostOnlyMiddleware } from "../../lib/auth/host.js"
import q2m from "query-to-mongo"

const accomadationRouter = express.Router()

accomadationRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newAccomadation = new AccomadationModel(req.body)
      const { _id } = await newAccomadation.save()

      res.status(201).send({ _id })
    } catch (error) {
      next(403, "Host Only Endpoint!")
    }
  }
)

accomadationRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await AccomadationModel.find().populate({
      path: "user",
      //   options: { strictPopulate: false },
    })

    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})
// accomadationRouter.get("/", async (req, res, next) => {
//   try {
//     const mongoQuery = q2m(req.query)
//     const accomadation = await AccomadationModel.countDocuments(
//       mongoQuery.criteria
//     )
//     const accomadationItem = await AccomadationModel.find(
//       mongoQuery.criteria,
//       mongoQuery.options.fields
//     )
//       .limit(mongoQuery.options.limit)
//       .skip(mongoQuery.options.skip)
//       .sort(mongoQuery.options.sort)
//       .populate({ path: "Users" }) //http://localhost:3001/accomadationItem?title=Windows Internals1

//     res.send({
//       links: mongoQuery.links(
//         "http://localhost:3001/accomadation",
//         accomadation
//       ),
//       accomadation,
//       totalPages: Math.ceil(accomadation / mongoQuery.options.limit),
//       accomadationItem,
//     })
//   } catch (error) {
//     next(error)
//   }
// })

accomadationRouter.get("/:id", async (req, res, next) => {
  try {
    const accomadation = await AccomadationModel.findById(req.params.id)
    if (accomadation) {
      res.send(accomadation)
    } else {
      next(createHttpError(404, `Id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

accomadationRouter.put(
  "/:id",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomadation = await AccomadationModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )

      if (accomadation) {
        res.send(accomadation)
      } else {
        next(createHttpError(404, `Id ${req.params.id} not found!`))
      }
    } catch (error) {
      next(error)
    }
  }
)

accomadationRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomadation = await AccomadationModel.findByIdAndDelete(
        req.params.id
      )
      if (accomadation) {
        res.status(204).send()
      } else {
        next(createHttpError(404, `Id ${req.params.id} not found!`))
      }
    } catch (error) {
      next(error)
    }
  }
)

export default accomadationRouter
