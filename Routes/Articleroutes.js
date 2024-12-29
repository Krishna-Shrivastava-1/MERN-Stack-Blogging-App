import express from "express";
import Article from "../Models/Article.js";
import User from "../Models/User.js";
import { verifytoken } from "./Authroutes.js";




const app = express
const router = app.Router()

// Creating Article
router.post('/createarticle', verifytoken, async (req, res) => {

    try {
        const { title, content, imageurl } = req.body
        if (!title || !content) {
            res.status(404).json({ message: 'please make article properly' })
        }
        const createarticle = new Article({ title, content, imageurl, createdBy: req.user.id })
        await createarticle.save()
        return res.status(200).json({
            message: 'Article Created Successfully',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
})

//  Get All Articles

router.get('/getallarticles', async (req, res) => {
    try {
        const articles = await Article.find()
        if (!articles) {
            res.status(401).json({ message: 'No Articles are here' })
        }
        return res.status(200).json(articles)
    } catch (error) {
        console.log(error)
    }
})
//  Get  Articles by id

router.get('/getarticlesbyid/:id', async (req, res) => {
    try {
        const { id } = req.params
        const articles = await Article.findById(id)
        if (!articles) {
            res.status(401).json({ message: 'No Articles are here' })
        }
        return res.status(200).json(articles)
    } catch (error) {
        console.log(error)
    }
})


// Getting All Articles by User

router.get('/gettingallarticlebyuser/:id', async (req, res) => {
    const { id } = req.params
    try {

        const allarticle = await Article.find({ createdBy: id })
        if (!allarticle) {
            res.status(401).json({ message: 'No Articles posted yet' })
        }
        return res.status(200).json({
            allarticle
        })
    } catch (error) {
        console.log(error)
    }
})

// Changing article data by id
router.put('/changearticledata/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, imageurl } = req.body


        const updateddata = await Article.findByIdAndUpdate(id,
            { title, content, imageurl }, { new: true })

        return res.status(200).json({ message: 'Article updated Succesfully', success: true, updateddata })
    } catch (error) {
        console.log(error)
    }
})

// Deleting article by id
router.delete('/deletearticle/:id', async (req, res) => {
    try {
        const { id } = req.params

        const updateddata = await Article.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Article Deleted Succesfully', success: true, deletedarticle: updateddata })
    } catch (error) {
        console.log(error)
    }
})


// Getting article data with Author
router.get('/getuserandarticle',async(req,res)=>{
    try {
        const getuserandarticle = await Article.find().populate('createdBy' , 'name email createdAt updatedAt')
        if (!getuserandarticle) {
            res.status(404).json({message:'No rticle found'})
        }
        return res.status(201).json(getuserandarticle)
    } catch (error) {
        res.status(500).json({message:'server error'})
        console.log(error)
    }
})


// Getting article data with Author using article ID also
router.get('/getuserandarticlebyid/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const getuserandarticle = await Article.findById(id).populate('createdBy' , 'name email createdAt updatedAt views')
        if (!getuserandarticle) {
            res.status(404).json({message:'No article found'})
        }
        return res.status(201).json([getuserandarticle])
    } catch (error) {
        res.status(500).json({message:'server error'})
        console.log(error)
    }
})


// Getting article data with Author using Author ID 
router.get('/getuserandarticlebyloggedid/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const getuserandarticle = await Article.find({createdBy :id}).select('title content createdAt imageurl views like')
        if (!getuserandarticle) {
            res.status(404).json({message:'No article found'})
        }
        return res.status(201).json(getuserandarticle)
    } catch (error) {
        res.status(500).json({message:'server error'})
        console.log(error)
    }
})

// Incrementing Views on Article
router.put('/increaseviews/:id',async(req,res)=>{
    try {
        const {id}= req.params
        const incvi = await Article.findByIdAndUpdate(id,{$inc:{views:1}},{new:true})
        return res.status(200).json(incvi)
    } catch (error) {
        console.log(error)
    }
})


// Like and Dislike in Article
router.put('/likeanddislike/:id',async(req,res)=>{
    try {
        const loggedid = req.body.userid
        // console.log( 'loggeduserid', loggedid)
        const {id} = req.params
        const articleid = await Article.findById(id)
        if (articleid.like.includes(loggedid)) {
            await Article.findByIdAndUpdate(id,{$pull:{like:loggedid}})
            return res.status(200).json({
                message:'Unliked Successfully'
            })
        } else {
            await Article.findByIdAndUpdate(id,{$push:{like:loggedid}})
            return res.status(200).json({
                message:'Liked Successfully'
            })
        }
    } catch (error) {
        console.log(error)
    }
})

export default router;