import mongoose, { Schema } from "mongoose";

const launchSchema = new Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission:{
        type: String,
        required: true
    },
    rocket:{
        type: String,
    },
    target:{
        type: String,
        required: true
    },
    customers:[ String ],
    upcoming:{
        type: Boolean,
        required: true
    },
    success:{
        type: Boolean,
        required: true,
        default: true
    }
})

export default mongoose.model('Launch',launchSchema);