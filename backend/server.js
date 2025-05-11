import express from 'express'   //importando el paquete express
import dotenv from 'dotenv' 
import { connectDB }  from './config/db.js'
import router from './routes/routes.js' //importando las rutas

const app = express()           //creando una instancia de express
dotenv.config()

app.use(express.json())       //para que el servidor pueda recibir datos en formato JSON
app.use("api/productos", router) //asignando la ruta a la api

//creando una peticion de tipo GET
app.get("/",(req, res) => {
    res.send("Esta es una prueba con la conexión al servidor")
})

const PORT = process.env.PORT

const MONGO_URL =  process.env.MONGO_URL

app.listen(PORT, (req, res) => {
    console.log(`Servidor corriendo http://localhost: ${PORT}`)	            //mostrando por consola
})                                                                          //el estado de la conexión


const inicio = async() =>{
    try{
        await connectDB(MONGO_URL)
        console.log("¡¡¡ Conectado a la base de datos de Mongo !!!")
        console.log(`Servidor corriendo http://localhost: ${PORT}`)	
    } catch(error){
        console.log(error)
    }
}

inicio()