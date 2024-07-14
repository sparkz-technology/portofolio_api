import app from "./app.js"
import constant from "./configs/constant.js"
import connectDB from "./configs/db.js"

const { PORT } = constant

await connectDB()
app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`)
})
