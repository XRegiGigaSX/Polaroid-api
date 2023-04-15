import mongoose from 'mongoose'

const googleUserSchema = mongoose.Schema({
    name: {type: String, required: true},
    email : {type: String, required: true},
    id : {type: String}

})



export default mongoose.model("GoogleUser", googleUserSchema);