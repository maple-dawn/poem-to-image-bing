import "dotenv/config";

import { BingImageCreator } from "./bing-image-creator";
import type { SentenceResponse, Response } from "./types";

// 使用环境变量替代导入的常量
const SENTENCE_API = process.env.SENTENCE_API;

/**
 * Get the sentence
 * @returns SentenceResponse
 * @throws {Error} The error
 **/
async function getSentence(): Promise<SentenceResponse> {
    try {
        if (!SENTENCE_API) {
            throw new Error("SENTENCE_API environment variable is not set");
        }
        const res = await fetch(SENTENCE_API);
        const data: SentenceResponse = await res.json();
        return data;
    } catch (e) {
        throw new Error("Request Sentence failed: ", e);
    }
}

async function getImageBySentence(cookie: string): Promise<Response> {
    const bingImageCreator = new BingImageCreator({
        cookie: cookie,
    });

    const res = await getSentence();
    console.log("getSentence Result: ", res);

    const prompt = `${res.content}, textless`;
    try {
        const images = await bingImageCreator.createImage(prompt);
        return {
            images,
            content: res.content,
            origin: res.origin,
            author: res.author,
            category: res.category,
        };
    } catch (error) {
        throw new Error(`Bing Image create failed: ${error.message}`);
    }
}

export { getImageBySentence };
