const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'https://malewiczmethod.com',
    'http://localhost:3000',
    'https://abtestingviewer.vercel.app'
];


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === 'null' || allowedOrigins.includes(origin)) {
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
    const { uniqueId, scenario } = req.body;

    if (!scenario && !uniqueId) {
        return res.status(400).json({ error: 'Either uniqueId or scenario is required' });
    }

    try {
        let session = null;

        if (uniqueId) {
            session = await prisma.malewiczSession.findUnique({
                where: { uniqueId },
                include: { subscriber: true },
            });

            if (session && session.subscriber) {
                return res.status(409).json({ error: 'This session already has a subscriber' });
            }
        }

        if (!session && scenario) {
            session = await prisma.malewiczSession.create({
                data: {
                    uniqueId: uuidv4(),
                    scenario,
                },
            });
        }

        if (!session) {
            return res.status(400).json({ error: 'Unable to create or find session' });
        }

        const subscriber = await prisma.malewiczSubscriber.create({
            data: {
                session: {
                    connect: { id: session.id },
                },
            },
        });

        res.status(201).json({
            message: 'Subscription logged successfully',
            subscriber,
        });
    } catch (error) {
        console.error('Error logging subscription:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already subscribed' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/sessions', async (req, res) => {
    try {
        const sessions = await prisma.malewiczSession.findMany({
            include: {
                subscriber: true,
            },
        });
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await prisma.malewiczSubscriber.findMany({
            include: {
                session: true,
            },
        });
        res.status(200).json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running`);
});
