import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "El título es obligatorio"],
        },
        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria"],
        },
        fecha_limite: {
            type: Date,
            required: [true, "La fecha límite es obligatoria"],
        },
        materia: {
            type: String,
            required: [true, "La materia es obligatoria"],
        },
        estado: {
            type: String,
            required: [true, "El estado es obligatorio"],
        },
        tareaId: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    } 
);

// Hook para copiar _id en tareaId después de creare, (toma el _id por defecto de mongo y lo pone en tareaId)
taskSchema.pre('save', function (next) {
    if (!this.tareaId) {
        this.tareaId = this._id;
    }
    next();
});

export const TaskModel = mongoose.model("Tarea", taskSchema);

