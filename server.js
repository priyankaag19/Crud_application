const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://priyankacrudapp:xA61Sm2LG8hfAVsT@priyanka.egqlius.mongodb.net/contacts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('MongoDB connection error:', error);
});

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});

const Contact = mongoose.model('contact_lists', contactSchema);

// Routes
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/contacts', async (req, res) => {
    const contact = new Contact(req.body);
    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findByIdAndDelete(id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
