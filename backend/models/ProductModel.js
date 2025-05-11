import mongoose from 'mongoose';

//Creando el schema del documento (modelo)
const productSchema = new mongoose.Schema(
    {
        descripcion: {
        type: String,
        required: [true, "la descripcion es obligatoria"],
        },
        stock: {
            type: Number,
            required: [true, "el stock es obligatorio"],
        },
        precio: {
            type: Number,
            required: [true, "el precio es obligatorio"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

//Creando el modelo a partir del schema
export const ProductoModel = mongoose.model("Producto", productSchema);