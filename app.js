const express = require("express")
const app = express()
const { sequelize, User, Post } = require("./models")
const PORT = process.env.PORT || 5000

//parsing json data
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post("/users", async (req, res) => {
  const { name, email, role } = req.body

  try {
    const user = await User.create({ name, email, role })
    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err)
    return res
      .status(400)
      .json({ success: false, error: "something went wrong" })
  }
})

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll()
    return res.status(200).json({ success: true, data: users })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" })
  }
})

app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId
  try {
    const user = await User.findOne({
      where: { uuid: userId },
      include: "posts",
    })
    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" })
  }
})

app.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId
  const { name, email, role } = req.body
  try {
    const user = await User.findOne({
      where: { uuid: userId },
    })
    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role

    await user.save()
    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" })
  }
})

app.delete("/users/:userId", async (req, res) => {
  const userId = req.params.userId
  try {
    const user = await User.findOne({
      where: { uuid: userId },
    })
    await user.destroy()
    return res.status(200).json({ success: true, data: "user deleted" })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" })
  }
})

app.post("/posts", async (req, res) => {
  const { userUuid, body } = req.body

  try {
    const user = await User.findOne({
      where: { uuid: userUuid },
    })
    const post = await Post.create({ body, userId: user.id })
    return res.status(200).json({ success: true, data: post })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" })
  }
})

app.get("/posts", async (req, res) => {
  try {
    const post = await Post.findAll({ include: ["user"] })
    return res.status(200).json({ success: true, data: post })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" })
  }
})

app.listen(PORT, async () => {
  console.log(`server is running on port ${PORT}`)
  await sequelize.authenticate()
  console.log(`database connected`)
})
