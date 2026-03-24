import OpenAI from 'openai';

// This automatically uses the hidden OPENAI_API_KEY from Vercel
const openai = new OpenAI();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const userMessage = req.body.prompt;

        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Or whatever model you prefer
            messages: [
                { 
                    role: "system", 
                    content: "Je bent de virtuele sales assistent van Fyxo, een webdesign bureau gerund door Sven (de technische architect) en Kjell (de conversie expert). Jouw doel is om bezoekers te helpen, vragen over prijzen (Starter €199, Business €299, Custom op aanvraag) te beantwoorden, en ze te overtuigen om contact op te nemen via het formulier of WhatsApp. Wees behulpzaam, professioneel en beknopt." 
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const aiReply = completion.choices[0].message.content;
        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Er ging iets mis met het genereren van het antwoord.' });
    }
}
