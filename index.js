const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === 'null') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

app.use(express.json());

app.post('/michal-subscribe', async (req, res) => {
    const { email, scenario } = req.body;

    if (!email || !scenario) {
        return res.status(400).json({ error: 'Email and scenario are required' });
    }

    try {
        const existingSubscriber = await prisma.malewiczSubscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            return res.status(409).json({ message: 'Email is already subscribed' });
        }

        await prisma.malewiczSubscriber.create({
            data: { email, scenario },
        });

        res.status(201).json({ message: 'Subscription successful' });
    } catch (error) {
        console.error('Error processing subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running`);
});
