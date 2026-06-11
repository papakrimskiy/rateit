const axios = require("axios");

exports.analyzeReview = async (text, rating) => {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "qwen2.5:7b",
      prompt: `
        Проаналізуй відгук.

        Відповідай ТІЛЬКИ валідним JSON.
        Без markdown.
        Без пояснень.

        Правила:
        - summary = короткий висновок українською
        - pros = 1-4 коротких тегів
        - cons = 1-4 коротких тегів
        - теги повинні бути ІМЕННИКАМИ
        - теги мають відповідати тексту
        - всі pros і cons повинні бути українською мовою навіть якщо мова відгуку англійська
        - використовуй короткі іменники або словосполучення українською
        - заборонено використовувати англійські слова (окрім назв брендів)
        - кожен тег максимум 1–2 слова
        - теги мають бути узагальненими (наприклад: "дизайн", "батарея", "ціна")
        - не вигадуй інформацію
        - якщо мінусів немає → cons: []
        - якщо плюсів немає → pros: []
        - якщо відгук пустий то став positive sentiment, якщо оцінка 4 або 5 і negative якщо оцінка 1, 2 або 3
        - якщо відгук пустий то summary, pros та cons повинні бути пустими
        - якщо відгук не пустий то summary ОБОВ'ЯЗКОВИЙ
        - summary = 1 коротке речення українською
        - summary повинен описувати загальне враження автора
        - summary максимум 15 слів

        Формат:
        {
          "sentiment": "positive|neutral|negative",
          "summary": "",
          "pros": [],
          "cons": []
        }

        Якщо відгук не пустий, а summary пустий — відповідь НЕВАЛІДНА.

        Текст:
        ${text}
      `,
      stream: false,
      options: {
        temperature: 0.2
      }
    });

    let output = response.data.response;

    // 🔥 витягуємо JSON навіть якщо модель додає текст
    const match = output.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("No JSON found in AI response");

    console.log("OLLAMA RAW:", response.data);
    const json = JSON.parse(match[0]);

    return json;

  } catch (err) {
    console.log("OLLAMA FULL ERROR:");
    console.dir(err, { depth: null });

    return {
      sentiment: "neutral",
      summary: "AI unavailable",
      pros: [],
      cons: []
    };
  }
};