const axios = require("axios");

exports.analyzeReview = async (text, rating) => {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `
        Ти аналізуєш відгуки українською мовою.

        Поверни ТІЛЬКИ valid JSON.
        Без пояснень.
        Без markdown.
        Без тексту до або після JSON.

        Правила:
        - sentiment: positive / negative
        - summary: короткий підсумок українською (1-2 речення)
        - pros: короткі позитивні теги українською
        - cons: короткі негативні теги українською
        - pros/cons НЕ повинні бути реченнями
        - pros/cons = лише короткі теги або категорії
        - НЕ описуй проблему реченням
        - правильний приклад cons: ["Очікування"]
        - неправильний приклад cons: ["Очікування інколи буває довгим"]
        - приклади хороших тегів:
          ["Смак", "Ціна", "Екран", "Камера", "Автономність"]
        - приклади поганих тегів:
          ["Піцца дуже смачна"]
          ["Waiting time can be long"]

        Формат:
        {
          "sentiment": "positive",
          "summary": "",
          "pros": [],
          "cons": []
        }

        Текст: ${text}
        Оцінка: ${rating}
      `,
      stream: false
    });

    let output = response.data.response;

    // 🔥 витягуємо JSON навіть якщо модель додає текст
    const match = output.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("No JSON found in AI response");

    console.log("OLLAMA RAW:", response.data);
    const json = JSON.parse(match[0]);

    return json;

  } catch (err) {
    console.log("Ollama error:", err.message);

    return {
      sentiment: "neutral",
      summary: "AI unavailable",
      pros: [],
      cons: []
    };
  }
};