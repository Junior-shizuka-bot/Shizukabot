const axios = require('axios');

// Define the fonts mapping
const fonts = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
    J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
    S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
};

async function fetchFromAI(url, params) {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAIResponse(input, userId, messageID) {
    const services = [
        { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: userId } },
        { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
        { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
        { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
    ];

    let response = "𝗕𝗼𝗻𝗷𝗼𝘂𝗿! 𝗝𝗲 𝘀𝘂𝗶𝘀 𝗹à 𝗽𝗼𝘂𝗿 𝘁'𝗮𝗶𝗱𝗲𝗿 𝗲𝘁 𝗿é𝗽𝗼𝗻𝗱𝗿𝗲 à 𝘁𝗲𝘀 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀. 𝗡'𝗵é𝘀𝗶𝘁𝗲 𝗽𝗮𝘀 à 𝗺𝗲 𝗱𝗲𝗺𝗮𝗻𝗱𝗲𝗿 𝗰𝗲 𝗾𝘂𝗲 𝘁𝘂 𝘃𝗲𝘂𝘅!....🍀\nSi tu veux une version plus décontracté de moi appelle moi Ghost...🍀";
    let currentIndex = 0;

    for (let i = 0; i < services.length; i++) {
        const service = services[currentIndex];
        const data = await fetchFromAI(service.url, service.params);
        if (data && (data.gpt4 || data.reply || data.response)) {
            response = data.gpt4 || data.reply || data.response;
            break;
        }
        currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
    }

    // Convert response to special fonts
    const convertedResponse = Array.from(response)
        .map(char => fonts[char] || char) // Use special font or original character if not in fonts
        .join('');

    return { response: convertedResponse, messageID };
}

module.exports = {
    config: {
        name: 'ai',
        author: 'aesther',
        role: 0,
        category: 'Ai',
        shortDescription: 'ai to ask anything',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) {
            api.sendMessage(`🫰✰`, event.threadID, event.messageID);
            return;
        }

        const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
        api.sendMessage(`✰...𝔻𝕒𝕧𝕚𝕕 𝐩𝐫𝐨𝐜𝐞̀𝐝𝐞 𝐚 𝐯𝐨𝐭𝐫𝐞 𝐫𝐞𝐪𝐮𝐞̂𝐭𝐞...✰`, event.threadID, messageID);
    },
    onChat: async function ({ event, message }) {
        const messageContent = event.body.trim().toLowerCase();
        if (messageContent.startsWith("ai")) {
            const input = messageContent.replace(/^ai\s*/, "").trim();
            const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
            // Construct message with special fonts
            const formattedResponse = ` ✿❯─-───────-─❮✿\n\n✿─❮${response}❯─✿\n \n✿❯─-───────-─❮✿`;
            message.reply(formattedResponse, messageID);
        }
    }
};
