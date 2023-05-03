const express = require("express")
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors")
const Tutorial = require("./app/models/tutorial.model.js")

const app = express()

app.use(cors())

// parse requests of content-type - application/json
app.use(express.json()) /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  const title = req.query.title

  Tutorial.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      })
    else res.send(data)
  })
})




app.put("/:id", (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    })
  }

  console.log(req.body)

  Tutorial.updateById(
    req?.params?.id,
    new Tutorial(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Tutorial with id ${req.params.id}.`
          })
        } else {
          res.status(500).send({
            message: "Error updating Tutorial with id " + req.params.id
          })
        }
      } else res.send(data)
    }
  )

})
app.post("/", (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    })
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published || false
  })

  // Save Tutorial in the database
  Tutorial.create(tutorial, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      })
    else res.send(data)
  })
})




app.delete("/:id", (req, res) => {
  Tutorial.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id ${req.params.id}.`
        })
      } else {
        res.status(500).send({
          message: "Could not delete Tutorial with id " + req.params.id
        })
      }
    } else res.send({ message: `Tutorial was deleted successfully!` })
  })
})



require("./app/routes/tutorial.routes.js")(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
