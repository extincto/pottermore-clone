const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const massive = require('massive');
const authControllers = require('./controllers/auth-controllers');
const sqControllers = require('./controllers/sqcontrollers');
const storeControllers = require('./controllers/store-controllers');
const session = require('express-session');

//

const app = express();

let {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env;

massive(CONNECTION_STRING).then(db => {
    console.log('db set')
    app.set('db', db);
})

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.json());

//app.use( express.static( `${__dirname}/../build` ) );

//ENDPOINTS

//Auth endpoints
//Create new user
app.post('/auth/new_user', authControllers.create_user);

//Get all usernames to verify that there are no duplicate usernames for bcrypt
app.get('/auth/all_usernames', authControllers.all_usernames);

app.post('/auth/login', authControllers.login);

app.get('/auth/logout', authControllers.logout);

app.get('/api/current_user', authControllers.current_user);

// Here will lie the endpoints for the sorting quiz.

app.get('/api/sortingquiz/questions', sqControllers.sortingQuestions)

app.get('/api/sortingquiz/answers', sqControllers.sortingAnswers)

//Add an item to the user's cart
app.post('/api/cart', storeControllers.addToCart)
//Get all items in specific users cart
app.get('/api/cart',storeControllers.getCart)
//Get all items in the store
app.get('/api/products', storeControllers.getProducts)
//Get Cart and item details
app.get('/api/details',storeControllers.cartDetails)
//Delete Item from shopping Cart
app.delete('/api/product/:id',storeControllers.deleteProduct)
//Add Item To Cart
app.put('/api/cart', storeControllers.addToCart)
//Delete PRODUCT from shopping Cart
app.put('/api/delete/',storeControllers.deleteItem)

app.listen(SERVER_PORT, () => {
    console.log(`Server docked in port ${SERVER_PORT}`)
});