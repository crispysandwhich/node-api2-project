// implement your posts router here
const express = require('express');

const router = express.Router();

const Post = require('./posts-model');

router.get('/', (req, res) => {
    Post.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch((err) => {
        res.status(500).json({ message: err.message })
    })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(posts => {
        if(posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ message:'The post with the specified ID does not exist'})
        }
    })
    .catch((err) => {
        res.status(500).json({ message: err.message })
    })
})

router.post('/', (req, res) => {
    const {title, contents} = req.body

    if(!title || !contents){
        res.status(400).json({ message: 'Please provide title and contents for the post'})
    } else {
      Post.insert(req.body)
        .then((post) => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
})

router.put('/:id', (req, res) => {
  const changes = req.body
  Post.update(req.params.id, changes)
      .then(p => {
          if(!changes.title || !changes.contents){
              res.status(400).json({
                  message: "Please provide title and contents for the post"
              })
          }else if(p) {
              res.status(200).json(p)
          }else {
                  res.status(404).json({
                      message: "The post with the specified ID does not exist"
                  })
          }
      })
      .catch(e => {
          console.log(e)
          res.status(500).json({
              message: "The post information could not be modified"
          })
      })
})

router.delete('/:id', (req, res) => {
  Post.remove(req.params.id)
      .then(p => {
          if(!p) {
              res.status(404).json({
                  message: "The post with the specified ID does not exist"
              })
          }else {
              res.json(p)
          }
      })
      .catch(e => {
          console.log(e)
          res.status(500).json({
              message: "The post could not be removed"
          })
      })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Post.findPostComments(id)
    .then(posts => {
        if(!posts) {
            res.status(404).json({ message: 'The post with the specified ID does not exist'})
        } else {
            console.log(posts)
            res.status(200).json(posts)
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
})

module.exports = router; 