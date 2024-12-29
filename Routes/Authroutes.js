import express from 'express'
import bcryptjs from 'bcryptjs'
import User from '../Models/User.js'
import jwt from 'jsonwebtoken'


const app = express
const router = app.Router()
const secretKey = process.env.secretkey || 'sdjhvakvkewvyvaickveyvcwcywiwrwerewgbcbjsh'
// Registration Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existinguser = await User.findOne({ email })
        if (existinguser) {
          return  res.status(404).json({
                message: 'User already exist'
            })
        }
        const hashedpassword = await bcryptjs.hash(password, 10)
        const newuser = new User({ name, email, password: hashedpassword })
        await newuser.save()
        return res.status(200).json({
            message: 'User registered Succesfully',
            success: true
        })

    } catch (error) {
      return  res.status(500).json({
            messgae: 'Server error',
            success: false
        })
    }
})

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
        }
        const ispasswordcorect = await bcryptjs.compare(password, user.password)
        if (!ispasswordcorect) {
            res.status(404).json({
                message: 'Invalid Credentials'
            })
        }
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1d' })
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            token: token,
            message: `User Logged in sucessfully Welcome Back  ${user.name}`,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
})

// Logout Route

router.post('/logout', async (req, res) => {
    try {
        return res.cookie('token', '', {
            httpOnly: true,
            expiresIn: new Date(0)
        }).json({
            message: 'logout successfully',
        })

    } catch (error) {

    }
})

// Get User by Id
router.get('/gettinguserbyid/:id', async (req, res) => {
    try {
        const { id } = req.params
        const getuser = await User.findById(id).select('-password')
        if (!getuser) {
            res.status(401).json({
                message: 'No such User found'
            })
        }
        return res.status(200).json(getuser)
    } catch (error) {
        console.log(error)
    }
})






export const verifytoken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token

    if (!token) {
        res.status(404).json({ message: 'Unauthorized token' })
    }
    try {
        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    } catch (error) {
        console.log('Invaid Token')
    }

}

export default router