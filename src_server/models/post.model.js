let posts = require('../data/posts.json');
const filename = './src_server/data/posts.json';
const helper = require('../helpers/helper.js');

function getPosts() {
    return new Promise((resolve) => {
        resolve(posts);
    })
}

function getPost(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(posts, id)
        .then(post => resolve(post))
        .catch(err => reject(err));
    });
}

function insertPost(newPost) {
    return new Promise((resolve) => {
        const id = { id: helper.createId() };
        newPost = { ...id, ...newPost };
        posts.push(newPost);
        helper.writeJSONFile(filename, posts);
        resolve(newPost);
    })
}

function updatePost(id, newPost) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(posts, id)
        .then(post => {
            const index = posts.findIndex(p => p.id === post.id);
            id = { id: post.id };
            posts[index] = { ...id, ...newPost };
            helper.writeJSONFile(filename, posts);
            resolve(posts[index])
        })
        .catch(err => reject(err))
    })
}

function deletePost(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(posts, id)
        .then(() => {
            posts = posts.filter(p => p.id !== id);
            helper.writeJSONFile(filename, posts);
            resolve();
        })
        .catch(err => reject(err));
    })
}

module.exports = {
    insertPost,
    getPosts,
    getPost, 
    updatePost,
    deletePost
};