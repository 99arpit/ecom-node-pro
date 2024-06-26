import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';

// Registration controller
export const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country, phone, answer } = req.body;

        // Validation
        if (!name || !email || !password || !address || !city || !country || !phone || !answer) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all fields',
            });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: 'User already exists, please login',
            });
        }

        // Create new user
        const user = await userModel.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone,
            answer,

        });

        res.status(201).send({
            success: true,
            message: 'Registration successful, please login',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in register API',
            error: error.message
        });
    }
};

// Login controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check user
        const user = await userModel.findOne({ email });

        // User validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        // Password validation (assuming you store hashed passwords)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials'
            });
        }


        //token
        const token = user.getJwtToken();
        // Successfully authenticated
        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,

        }).send({
            success: true,
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login API",
            error: error.message
        });
    }
};


// Get user profile controller
export const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);


        user.password = undefined; // Hide the password

        res.status(200).send({
            success: true,
            message: 'User profile retrieved successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in profile API',
            error
        });
    }
};

//logout
export const logoutController = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
        }).send({
            success: true,
            message: "logout successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in logout api",
            error,
        })
    }
}

//update user profile
export const updateUserProfileController = async (req, res) => {

    try {
        const user = await userModel.findById(req.user._id)
        const { name, email, address, city, country, phone } = req.body
        //validation + update
        if (name) user.name = name
        if (email) user.email = email
        if (address) user.address = address
        if (city) user.city = city
        if (country) user.country = country
        if (phone) user.phone = phone
        //save user
        await user.save()
        res.status(200).send({
            success: true,
            message: "user profile update",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in update profile api",
            error,
        })
    }
};


// //update user password
// export const updateUserPasswordController = async (req, res) => {

//     try {
//         const user = await userModel.findById(req.user._id)
//         const { oldPassword, newPassword } = req.body
//         //validation
//         if (!oldPassword || !newPassword) {
//             return res.status(400).send({
//                 success: false,
//                 message: "please enter old and new password",
//             })
//         }//old password chack
//         const isMatch = await bcrypt.comparePassword(oldPassword)
//         //validation
//         if (!isMatch) {
//             return res.status(500).send({
//                 success: false,
//                 message: "old password is incorrect",
//             })
//         }
//         user.password = newPassword
//         await user.save()
//         res.status(200).send({
//             success: true,
//             message: 'password update successfully'

//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "error in update password api",
//             error,
//         });
//     };
// }



// Ensure Cloudinary is configured
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const updateUserPasswordController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;

        // Validation
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide both old and new passwords",
            });
        }

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Error in update password API:', error);
        res.status(500).json({
            success: false,
            message: "Error in update password API",
            error: error.message, // Pass the error message for better debugging
        });
    }
};



//update user profile photo


export const updateProfilePicController = async (req, res) => {

    try {
        const user = await userModel.findById(req.user._id);


        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }


        //file get from client photo
        const file = getDataUri(req.file)

        // Delete previous image if it exists
        if (user.profilePic && user.profilePic.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }


        //update
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }

        //save funcation
        await user.save()

        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
        })

    } catch (error) {
        console.error('Error in update profile pic API:', error);
        res.status(500).send({
            message: "Error in update profile pic API",
            error: error.message || error,
        });
    }
};



// FORGOT PASSWORD
export const passwordResetController = async (req, res) => {
    try {
      // user get email || newPassword || answer
      const { email, newPassword, answer } = req.body;
      // valdiation
      if (!email || !newPassword || !answer) {
        return res.status(500).send({
          success: false,
          message: "Please Provide All Fields",
        });
      }
      // find user
      const user = await userModel.findOne({ email, answer });
      //valdiation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "invalid user or answer",
        });
      }
  
      user.password = newPassword;
      await user.save();
      res.status(200).send({
        success: true,
        message: "Your Password Has Been Reset Please Login !",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In password reset API",
        error,
      });
    }
  };