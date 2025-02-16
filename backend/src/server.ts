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
const MCQ_Dir = path.join(__dirname, 'MCQs');
if (!fs.existsSync(MCQ_Dir)) {
    fs.mkdirSync(MCQ_Dir, { recursive: true });
}
const answer_Dir = path.join(__dirname, 'Answer');
if (!fs.existsSync(answer_Dir)) {
    fs.mkdirSync(answer_Dir, { recursive: true });
}

///////////editor ending points///////////

app.post('/mcq/save', (req, res) => {
    const { title, mcqs } = req.body;

    // if (!title || !mcqs) {
    //         return res.status(400).json({ error: 'Title and MCQs are required' });
    //     }
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_'); 
    const filePath = path.join(MCQ_Dir, `${sanitizedTitle}.json`);

    fs.writeFile(filePath, JSON.stringify({ title, mcqs }, null, 2), (err) => {
        if (err) {
            console.error('Error saving file:', err);
              return res.status(500).json({ error: 'Failed to save MCQs' });
          }
        res.status(200).json({ message: 'MCQs saved successfully', file: filePath });
    });

});




///////////viewer ending points///////////

// let mcqData = {
//     title: "Sample MCQs",
//     mcqs: [
//         {
//             question: "What is the capital of France?",
//             options: ["Berlin", "Madrid", "Paris", "Rome"],
//             correctAnswer: 2
//         },
//         {
//             question: "Which planet is known as the Red Planet?",
//             options: ["Earth", "Mars", "Jupiter", "Venus"],
//             correctAnswer: 1
//         }
//     ]
// };

// app.get('/mcq/test', (req, res) => {
//     console.log('mcqData:', mcqData);
//     res.json(mcqData);
// });

app.get('/mcq/view-all', (req, res) => {
    fs.readdir(MCQ_Dir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: "Failed to read MCQ directory" });
        }

        // 过滤 JSON 文件，并去掉 `.json` 后缀以返回 `title`
        const titles = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));

        res.status(200).json({ titles });
    });
});


app.get('/mcq/view', (req, res) => {
    const { title } = req.query; // 从 URL 参数中获取 title

    // if (!title) {
    //     return res.status(400).json({ error: "Title query parameter is required" });
    // }

    const sanitizedTitle = (title as string).replace(/[^a-zA-Z0-9_-]/g, '_'); // 过滤非法字符
    const filePath = path.join(MCQ_Dir, `${sanitizedTitle}.json`);

    // if (!fs.existsSync(filePath)) {
    //     return res.status(404).json({ error: "MCQ file not found" });
    // }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read MCQ file" });
        }

        try {
            const mcqData = JSON.parse(data); // 解析 JSON 数据
            res.status(200).json(mcqData);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).json({ error: "Invalid JSON format in file" });
        }
    });
});

app.post('/mcq/save-answers', (req, res) => {
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
app.post('/mcq/analysis', async (req, res) => {
    const { title, mcqs } = req.body;

    // if (!title || !Array.isArray(mcqs) || mcqs.length === 0) {
    //     return res.status(400).json({ error: 'Title and valid MCQs are required' });
    // }

    try {
        // Generate AI analysis for each question
        const analysisPromises = mcqs.map(async (mcq: { question: any; options: any[]; }) => {
            const prompt = `
            You are an expert AI tutor. Analyze the following multiple-choice question and provide an insightful explanation.

            Your answer must be in 70 words or less, which is very important.

            **Question**: ${mcq.question}
            **Options**: ${mcq.options.join(', ')}

            Provide a very short analysis explaining what concept this question is testing and which option is correct with a brief explanation.
            `;

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
            });

            return response.choices[0]?.message?.content || 'No analysis generated.';
        });

        const analysisResults = await Promise.all(analysisPromises);

        res.status(200).json(analysisResults);
    } catch (error) {
        console.error('Error generating AI analysis:', error);
        res.status(500).json({ error: 'Failed to generate AI analysis' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
