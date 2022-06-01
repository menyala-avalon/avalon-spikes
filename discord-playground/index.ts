import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const public_key = process.env.PUBLIC_KEY || "";

app.use(express.json({ verify: VerifyDiscordRequest(public_key) }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/interactions', async function (req, res) {
    console.log(req.body)
    res.send("ok")
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});