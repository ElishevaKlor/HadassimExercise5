require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const corsOptions = require('./config/corsOptions')
const connectToDB = require('./config/ConnectToDB')
const cors = require('cors')
const multer = require("multer")
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const supplierController = require('./Controllers/SupplierController');
const orderController=require('./Controllers/orderController')
const storeGoodContoller=require('./Controllers/storeGoodController')
const PORT = process.env.PORT || 1500
const cookieParser = require('cookie-parser')
const upload = multer();
app.use(upload.none())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
const authRoutes = require('./Routes/authRoutes')
const supplierRoutes = require('./Routes/SupplierRoutes')
const orderRoutes = require('./Routes/orderRoutes')
const storeManagerRoutes = require('./Routes/storeManagerRoutes')
const goodRoutes = require('./Routes/goodRoutes')
const storeGoodRoutes=require('./Routes/storeGoodRoutes')
app.use('/api/auth', authRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/store-managers', storeManagerRoutes)
app.use('/api/goods', goodRoutes)
app.use('/api/storegoods',storeGoodRoutes)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})
supplierController.setSocketIO(io)
orderController.setSocketIO(io)
storeGoodContoller.setSocketIO(io)
connectToDB()
mongoose.connection.once('open', () => {
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
  })
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})

io.on('connection', (socket) => {
  socket.emit('hello', 'התחברת בהצלחה');
})
