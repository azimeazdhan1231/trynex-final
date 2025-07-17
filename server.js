
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static('.'));

// Serve admin files
app.use('/admin', express.static('admin'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/track-order', (req, res) => {
    res.sendFile(path.join(__dirname, 'track-order.html'));
});

app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// API endpoints for JSON data
app.get('/api/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.json'));
});

app.get('/api/categories', (req, res) => {
    res.sendFile(path.join(__dirname, 'categories.json'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`TryneX E-commerce Platform running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin`);
});
