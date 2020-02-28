const postModel = require('../src_server/models/post.model');
const posts = require('../src_server/data/posts.json');

test('get all posts', () => {
    return postModel.getPosts().then(data => {
        expect(posts.length).toBe(data.length);
    });
});

test('get post by ID', () => {
    const id = posts[0].id;

    return postModel.getPost(id).then(data => {
        expect(id).toBe(data.id);
    });
});

test('insert post', () => {
    const postData = {
        'id': '757dbd70',
        'name': 'Janis Konutis',
        'age': '26',
        'brand': 'Husqvarna',
        'plateNumber': '114',
        'country': 'Latvia'
    };

    return postModel.insertPost(postData).then(insertData => {
        return postModel.getPost(postData.id).then(data => {
            expect(insertData.id).toBe(data.id);
        });
    });
});