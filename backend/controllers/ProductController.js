import { ProductoModel } from "../models/ProductModel";

//Creando los métodos del CRUD
export const getProductos = (req, res) => {
    res.json({msg:"Muestra todos los productos"})
}

export const getProducto = (req, res) => {
    res.json({msg:"Muestra el producto por su id"})
}

export const createProducto = (req, res) => {
    const dato = req.body
    res.json({dato})
}

export const updateProducto = (req, res) => {
    res.json({msg:"Actualiza el producto por su id"})
}

export const deleteProducto = (req, res) => {
    res.json({msg:"Elimina el producto por su id"})
}