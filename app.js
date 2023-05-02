// https://data.covid19india.org/v4/min/data.min.json (Api for covid 19 data)
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path')
const bodyParser = require('body-parser');
const nodeNotifier = require('node-notifier')
const methodOverride = require('method-override');
const app = express()

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/BlogDB")
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
const UserPost = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    author: { type: String },
    Category: { type: String },
    date: { type: String }
})
const Post = mongoose.model("Post", UserPost)

app.post('/post', (req, res) => {
    const NewPost = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        Category: req.body.Category,
        date: req.body.date
    })
    console.log(NewPost);
    if (Post.findOne({ title: req.body.title }) == true) {
        console.log("Already Exist");
        nodeNotifier.notify({
            title: "Change the title",
            message: "title already exists"
        })
        res.redirect('/post')
        return;
    } else {
        NewPost.save();
        res.redirect('/')
    }

})

app.get('/post', (req, res) => {
    res.render('Post')
})
app.get('/', (req, res) => {
    Post.find({})
        .then((docs) => {
            // console.log(docs);
            res.render('main', { Posts: docs })
        })
})

app.get('/Technical', (req, res) => {
    Post.find({ Category: "Technical" })
        .then((docs) => {
            // console.log(docs);
            res.render('main', { Posts: docs })
        })
})
app.get('/Finance', (req, res) => {
    Post.find({ Category: "Finance" })
        .then((docs) => {
            // console.log(docs);
            res.render('main', { Posts: docs })
        })
})
app.get('/Personality', (req, res) => {
    Post.find({ Category: "Personality" })
        .then((docs) => {
            // console.log(docs);
            res.render('main', { Posts: docs })
        })
})
app.get('/AutoMobile', (req, res) => {
    Post.find({ Category: "AutoMobile" })
        .then((docs) => {
            // console.log(docs);
            res.render('main', { Posts: docs })
        })
})
// app.get('/Covid19', (req, res) => {
//     Post.find({ Category: "Covid19" })
//         .then((docs) => {
//             console.log(docs);
//             res.render('main', { Posts: docs })
//         })
// })
app.get('/Tutorials', (req, res) => {
    Post.find({ Category: "Tutorials" })
        .then((docs) => {
            // console.log(docs);
            res.render('main', { Posts: docs })
        })
})

app.get('/Edit/Blog/:title', (req, res) => {
    Post.findOne({ title: req.params.title })
        .then((doc) => {
            console.log(doc);
            res.render('Edit', { Found: doc })
        })
})

app.put('/Edit/Blog/:title', (req, res) => {
    Post.findOneAndUpdate({ title: req.params.title }, {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        Category: req.body.Category,
        date: req.body.date
    })
        .then(() => {
            console.log("Updated");
            res.redirect('/')
        })

})

app.get('/Blog/:title', (req, res) => {
    Post.findOneAndDelete({ title: req.params.title })
        .then((docs) => {
            nodeNotifier.notify({
                title: 'Your Post is Successfully Deleted',
                message:"Post Deleted"
            })
            res.redirect("/")

        })
    // app.delete('/Blog/:title?_method=DELETE', (req, res) => {
    //     Post.findOneAndDelete({ title: req.params.title })
    //         .then(() => {
    //             nodeNotifier({
    //                 title: "Successfully Deleted",
    //                 message: "Your Post is Deleted"
    //             })
    //             res.redirect('/')
    //         })
    // })

})

app.listen(3000, () => {
    console.log("Running");
})