import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { askLLM } from "./llm.js";
import { searchPlaces } from "./maps.js";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

// app.post("/chat", async (req, res) => {
//     const { prompt } = req.body;

//     const llmAnswer = await askLLM(prompt);

//     const isLocationQuery =
//         prompt.toLowerCase().includes("place") ||
//         prompt.toLowerCase().includes("restaurant") ||
//         prompt.toLowerCase().includes("eat");

//     if (isLocationQuery) {
//         const places = await searchPlaces(prompt);

//         return res.json({
//             answer: llmAnswer,
//             places,
//         });
//     }

//     res.json({ answer: llmAnswer });
// });

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    const answer = await askLLM(prompt);

    const isPlaceQuery = /eat|restaurant|place|cafe|food/i.test(prompt);

    let places = [];

    if (isPlaceQuery) {
        // const searchQuery = "restaurant in Jakarta";
        places = await searchPlaces(prompt);
    }

    res.json({
        answer,
        places,
    });
});

app.get("/openapi.json", (req, res) => {
    // res.json(JSON.parse(fs.readFileSync("./openapi.json", "utf-8")));
    const openapiPath = path.join(__dirname, "openapi.json");
    res.json(JSON.parse(fs.readFileSync(openapiPath, "utf-8")));
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.listen(8000, () => {
    console.log("Backend running on http://localhost:8000");
});
