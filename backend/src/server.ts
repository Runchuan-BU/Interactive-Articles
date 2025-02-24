import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();


const app: express.Application = express(); 
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:3000' })); 

// data path
const question_Dir = path.join(__dirname, 'Questions');
if (!fs.existsSync(question_Dir)) {
    fs.mkdirSync(question_Dir, { recursive: true });
}
const answer_Dir = path.join(__dirname, 'Answer');
if (!fs.existsSync(answer_Dir)) {
    fs.mkdirSync(answer_Dir, { recursive: true });
}

///////////editor ending points///////////

app.post('/questions/save', (req, res) => {
    const { title, questions = [] } = req.body; 

    // if (!title || questions.length === 0) {
    //     return res.status(400).json({ error: 'Title and at least one question are required' });
    // }

    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_'); 
    const filePath = path.join(question_Dir, `${sanitizedTitle}.json`);

    fs.writeFile(filePath, JSON.stringify({ title, questions }, null, 2), (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ error: 'Failed to save questions' });
        }
        res.status(200).json({ message: 'Questions saved successfully', file: filePath });
    });
});






///////////viewer ending points///////////

app.get('/questions/view-all', (req, res) => {
    fs.readdir(question_Dir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: "Failed to read MCQ directory" });
        }

        const titles = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));

        res.status(200).json({ titles });
    });
});


app.get('/questions/view', (req, res) => {
    const { title } = req.query; 

    // if (!title) {
    //     return res.status(400).json({ error: "Title query parameter is required" });
    // }

    const sanitizedTitle = (title as string).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(question_Dir, `${sanitizedTitle}.json`);

    // if (!fs.existsSync(filePath)) {
    //     return res.status(404).json({ error: "MCQ file not found" });
    // }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read MCQ file" });
        }

        try {
            const questionData = JSON.parse(data); 
            res.status(200).json(questionData);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).json({ error: "Invalid JSON format in file" });
        }
    });
});

app.post('/questions/save-answers', (req, res) => {
    const { title, answers } = req.body;

    // if (!title || !Array.isArray(answers)) {
    //     return res.status(400).json({ error: 'Title and answers are required' });
    // }

    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_'); 
    const filePath = path.join(answer_Dir, `${sanitizedTitle}_answers.json`);

    const answerData = {
        title,
        timestamp: new Date().toISOString(),
        answers,
    };

    fs.writeFile(filePath, JSON.stringify(answerData, null, 2), (err) => {
        if (err) {
            console.error('Error saving answers:', err);
            return res.status(500).json({ error: 'Failed to save answers' });
        }
        res.status(200).json({ message: 'Answers saved successfully', file: filePath });
    });
});



// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use .env file for API key
});

// AI Analysis API Endpoint
app.post('/questions/analysis', async (req, res) => {
    const { title, questions } = req.body; 

    // if (!title || !Array.isArray(questions) || questions.length === 0) {
    //     return res.status(400).json({ error: 'Title and valid questions are required' });
    // }

    try {
        // 生成 AI 解析
        const analysisPromises = questions.map(async (question: { type: string; question: string; options?: string[] }) => {
            let prompt = '';

            if (question.type === 'mcq') {
                
                prompt = `
                You are an expert AI tutor. Analyze the following multiple-choice question and provide an insightful explanation.

                Your answer must be in 70 words or less.

                **Question**: ${question.question}
                **Options**: ${question.options ? question.options.join(', ') : 'No options available'}


                Provide a short analysis explaining what concept this question is testing and which option is correct with a brief explanation.
                `;
            } else if (question.type === 'frq') {

                prompt = `
                You are an expert AI tutor. Analyze the following open-ended question and provide guidance on how to answer it effectively.

                Your response must be in 70 words or less.

                **Question**: ${question.question}

                Provide a short analysis explaining what key concepts or structure the answer should include.
                `;
            } else {
                return 'Invalid question type.';
            }

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
            });

            return response.choices[0]?.message?.content || 'No analysis generated.';
        });

        const analysisResults = await Promise.all(analysisPromises);

        const formattedResults = questions.map((q: { type: string; question: string }, index: number) => ({
            question: q.question,
            type: q.type, 
            analysis: analysisResults[index],
        }));

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error('Error generating AI analysis:', error);
        res.status(500).json({ error: 'Failed to generate AI analysis' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
