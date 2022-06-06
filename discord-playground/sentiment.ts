// @ts-nocheck
// twinword

import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

export async function analyseSentiment(text) {
    const options = {
        method: 'GET',
        url: 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
        params: { text: text },
        headers: {
            'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.TWINWORD_KEY
        }
    };
    const { data } = await axios.request(options);
    return data
}