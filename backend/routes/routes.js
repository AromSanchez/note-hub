import express from 'express';
import {getProductos, getProducto, createProducto, updateProducto, deleteProducto} from '../controllers/ProductController.js';

//Creando las rutas para cada método
const ruta = express.Router();

//Método 1
/*
ruta.get("/", getProductos); 
ruta.get("/:id", getProducto);
ruta.post("/", createProducto);
ruta.put("/:id", updateProducto);
ruta.delete("/:id", deleteProducto);
*/

//Método 2
ruta.route("/").get(getProductos).post(createProducto)
ruta.route("/:id").get(getProducto).put(updateProducto).delete(deleteProducto)

export default ruta;