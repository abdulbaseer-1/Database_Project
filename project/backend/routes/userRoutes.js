import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = Router();


// Route to fetch the authenticated user's profile
router.get('/getProfile', authenticateJWT, userController.getProfile);

// Route to update the authenticated user's profile
router.put('/updateProfile', authenticateJWT, userController.updateProfile);

// Route to create a new user (registration)
router.post('/signup', userController.createUser, ()=>{
    console.log("signup funct invoked");
});

// Route to login and get a JWT token
router.post('/signin', userController.loginUser, ()=>{
    console.log("login funct invoked");
});

// Route to delete the authenticated user
router.delete('/deleteProfile', authenticateJWT, userController.deleteUser);

// Route to logout the user (clear JWT token or session)
router.post('/logout', authenticateJWT, userController.logoutUser);

// to get user role
router.get('/role', authenticateJWT, getUserRole);

export default router;
