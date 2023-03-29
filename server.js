const jsonServer = require('json-server')
const clone = require('clone')
const data = require('./db.json')

const isProductionEnv = process.env.NODE_ENV === 'production';
const server = jsonServer.create()

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
})

// Add a new route for POST method to create a new resource
router.post('/', (req, res) => {
    const { title, url, category } = req.body;
    const newResource = { title, url, category };

    // Add the new resource to the database
    router.db.get('videos').push(newResource).write();

    // Respond with the newly created resource
    res.status(201).json({category});
});

const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data))
    next()
})

server.use(jsonServer.bodyParser); // Parse JSON request bodies

server.use(router)
server.listen(process.env.PORT || 8000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
