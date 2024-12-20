const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
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

app.post('/michal-session', async (req, res) => {
    const { scenario } = req.body;

    if (!scenario) {
        return res.status(400).json({ error: 'Scenario is required' });
    }

    try {
        const uniqueId = uuidv4();

        const session = await prisma.malewiczSession.create({
            data: {
                uniqueId,
                scenario,
            },
        });

        res.status(201).json({
            message: 'Session logged successfully',
            sessionId: session.id,
            uniqueId: session.uniqueId,
        });
    } catch (error) {
        console.error('Error logging session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/michal-subscribe', async (req, res) => {
    const { uniqueId } = req.body;

    if (!uniqueId) {
        return res.status(400).json({ error: 'Unique ID is required' });
    }

    try {
        const session = await prisma.malewiczSession.findUnique({
            where: { uniqueId },
            include: { subscriber: true },
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.subscriber) {
            return res.status(409).json({ error: 'This session already has a subscriber' });
        }

        const subscriber = await prisma.malewiczSubscriber.create({
            data: {
                session: {
                    connect: { id: session.id },
                },
            },
        });

        res.status(201).json({ message: 'Subscription logged successfully', subscriber });
    } catch (error) {
        console.error('Error logging subscription:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already subscribed' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running`);
});
