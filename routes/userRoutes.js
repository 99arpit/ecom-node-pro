import express from 'express'
import {
    loginController,
    logoutController,
    registerController,
    getUserProfileController,
    updateUserProfileController,
    updateUserPasswordController,
    updateProfilePicController,
    passwordResetController,
} from '../controllers/userController.js';

import { isAuth } from '../middlewares/authMiddlewares.js';
import { singleUpload } from '../middlewares/multer.js';

//router object

const router = express.Router()

//routes  

//register
router.post('/register', registerController);

//login
router.post('/login', loginController);

//profile
router.get('/profile', isAuth, getUserProfileController);

//logout
router.get('/logout', isAuth, logoutController)


//update profile
router.put('/profile-update', isAuth, updateUserProfileController)


//update user password
router.put('/update-password', isAuth, updateUserPasswordController)

//update profile pic
router.put('/update-picture', isAuth, singleUpload, updateProfilePicController)


// FORGOT PASSWORD
router.post("/reset-password", passwordResetController);


//export 
export default router
