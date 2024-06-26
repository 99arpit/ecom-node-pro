import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email already taken']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password should be greater than 6 characters'],
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    city: {
        type: String,
        required: [true, 'city is required']
    },
    country: {
        type: String,
        required: [true, 'country is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    profilePic: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    answer: {
        type: String,
        required: [true, "answer is required"],
    },
    role: {
        type: String,
        default: "user",
    }
}, {
    timestamps: true
});




// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});



//compare funcation
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//JWT token
userSchema.methods.getJwtToken = function () {
    return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};


export const userModel = mongoose.model("User", userSchema);  // Export as named export
export default userModel;