import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js'

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query
    // console.log(tags);
    // console.log(searchQuery)
    try{
        const title = new RegExp(searchQuery, 'i')
        const posts = await PostMessage.find({$or : [{ title }, { tags: { $in: tags.split(',')}}]})
        res.json({data: posts});

    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const getPosts = async (req, res) => {
    const {page} = req.query;
    try{
        const LIMIT = 12;
        const startIndex = (Number(page)-1)*LIMIT;
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({_id : -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});

    }catch(error){
        res.status(404).json({message: error.message})

    }
  
}

export const getPost = async(req, res) => {
    const {id} = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try{
        await newPost.save();
        res.status(201).json(newPost);
    }catch(error){
        res.status(409).json({message: error.message})

    }

}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with that id')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true})
    res.json(updatedPost)
}

export const deletePost = async (req, res) => {
    // console.log(req.userId);
    // console.log("am i here?")
    if(!req.userId) return res.json({message: "You must be logged in to perform this action!"})

    const { id: _id } = req.params;
    const postInfo = await PostMessage.findById(_id);
    // const author = postInfo.
    // console.log(`here ${_id}`);
    // console.log(postInfo);

    if(!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with that id')
    
    if(req.userId === postInfo.creator) {
        console.log("about to be deleted")
        await PostMessage.findByIdAndRemove(_id);
    }
    // else res.status(400).json({message: "You can't delete someone else's post."})
    else res.send({message: "You can't delete someone else's post"})
    res.json({message: "post deleted successfully"})
}

export const likePost = async (req, res) => {
    
    if(!req.userId) return res.json({message: "You must be logged in to perform this action!"})
    
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with that id')

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1){
        post.likes.push(req.userId);
    }else{
        // post.likes = post.likes.findByIdAndRemove((id) => id === String(req.userId))
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
    
    res.json(updatedPost)
}

export const commentPost = async(req, res) => {
    const {id} = req.params;
    const {value} = req.body;
    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
    res.status(200).json(updatedPost)
}