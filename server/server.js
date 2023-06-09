import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
// import bodyParser from 'body-parser';


dotenv.config();
console.log(process.env.OPEN_API_KEY)
const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});



const openai = new OpenAIApi(configuration);

const app =express();
// app.use(bodyParser.urlencoded({extended : true}))
app.use(cors());
app.use(express.json());

app.get('/', async(req, res)=>{
    res.status(200).send({
        message : 'hello',
    })
});

app.post('/', async (req,res)=>{
    try {
        console.log(req.body)
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {

        res.status(500).send({error})
    }
})

app.listen(3000,()=>{
    console.log("server is running http://localhost:3000");
})