const { ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { HNSWLib } = require('@langchain/community/vectorstores/hnswlib');
const { formatDocumentsAsString } = require('langchain/util/document');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence,
    RunnablePassthrough } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const dotenv = require('dotenv');
const fs = require('fs');
const { CheerioWebBaseLoader } = require('langchain/document_loaders/web/cheerio');
const path = require('path');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
dotenv.config();

const model = new ChatGoogleGenerativeAI({ modelName: "gemini-pro" });

// const vectorStore = await HNSWLib.fromTexts(
//   ["mitochondria is the powerhouse of the cell"],
//   [{ id: 1 }],
//   new GoogleGenerativeAIEmbeddings()
// );



/**
 * AIサービス
 */
module.exports = {

    /**
     * AI処理実行
     * 
     * @param {String} message   メッセージ
     * @return {String} AIからの返答
     */
    execAi: async function (message) {
        const docs1 = await new CheerioWebBaseLoader(
            "https://manadream.net/cgi3/etc/help.html"
        ).load();

        const docs2 = await new CheerioWebBaseLoader(
            "https://manadream.net/cgi3/index.html"
        ).load();

        const docs3 = await new CheerioWebBaseLoader(
            "https://dm.takaratomy.co.jp/rule/basic/basic08/"
        ).load();

        const docs4 = await new CheerioWebBaseLoader(
            "https://dm.takaratomy.co.jp/rule/regulation/"
        ).load();

        // // テキストファイル読み込み
        // const text = fs.readFileSync(path.basename("data.txt"), "utf8");
        // // 6.2.2. 指定されたチャンクサイズで RecursiveCharacterTextSplitter を作成する
        // const textSplitter = new RecursiveCharacterTextSplitter({
        //     chunkSize: 1000,
        // });
        // // 6.2.3. 入力テキストをドキュメントに分割する
        // const docs5 = textSplitter.createDocuments([text]);

        // let docs = docs1.concat(docs2).concat(docs3).concat(docs4).concat(docs5);
        let docs = docs1.concat(docs2);
        const vectorStore = await HNSWLib.fromDocuments(
            docs,
            new GoogleGenerativeAIEmbeddings()
        );
        const retriever = vectorStore.asRetriever();

        const prompt =
            PromptTemplate.fromTemplate(`You are a デュエルマスターズ対戦CGIのサポート.Answer the questions in a natural speaking manner based on the following context. If the context does not include an answer, simply answer " 答えが見つかりませんでした。 ". Please answer the question in as much detail as possible, rather than referring to the question.:
            {context}

            Question: {question}`);

        const chain = RunnableSequence.from([
            {
                context: retriever.pipe(formatDocumentsAsString),
                question: new RunnablePassthrough(),
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);

        const result = await chain.invoke(message);

        return result;
    },
};