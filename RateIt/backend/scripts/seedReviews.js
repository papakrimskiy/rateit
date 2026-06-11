const db = require("../db");
const { analyzeReview } = require("../services/aiService");

const products = [
  "CMF Phone 2 Pro by Nothing",
  "iPhone 15",
  "Samsung Galaxy S24",
  "AirPods Pro 2",
  "Xiaomi Redmi Note 13",
  "MacBook Air M2",
  "PlayStation 5",
  "Nintendo Switch OLED",
  "Sony WH-1000XM5",
  "Samsung Galaxy Watch 6"
];

const reviewsPool = [
    {
    user: "Ivan",
    text: "Телефон дуже швидкий, батарея тримає весь день",
    rating: 5,
    title: "Дуже задоволений",
    link: ""
    },
    {
    user: "Anna",
    text: "Камера нормальна, але іноді довго фокусується",
    rating: 4,
    title: "Є дрібні мінуси",
    link: ""
    },
    {
    user: "Oleh",
    text: "Дизайн топ, але ціна зависока",
    rating: 4,
    title: "Красивий але дорогий",
    link: ""
    },
    {
    user: "Kateryna",
    text: "Швидко розряджається, очікувала більше",
    rating: 2,
    title: "Розчарування",
    link: ""
    },
    {
    user: "Dmytro",
    text: "Все працює стабільно, без лагів",
    rating: 5,
    title: "Стабільна робота",
    link: ""
    },
    {
    user: "Ivan",
    text: "Телефон працює швидко, екран яскравий і батареї вистачає майже на весь день активного використання.",
    rating: 5,
    title: "Дуже хороший варіант",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Anna",
    text: "Сподобався дизайн і плавність роботи, але камера ввечері іноді шумить.",
    rating: 4,
    title: "Майже все супер",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Dmytro",
    text: "Користуюсь кілька тижнів — поки все стабільно, без лагів і зависань.",
    rating: 5,
    title: "Стабільна робота",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Oleh",
    text: "Очікував трохи більшої автономності, але в цілому пристрій хороший.",
    rating: 4,
    title: "Непогано",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Kateryna",
    text: "За свою ціну дуже достойний продукт. Особливо сподобався звук і якість матеріалів.",
    rating: 5,
    title: "Приємно здивував",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Maria",
    text: "Є дрібні недоліки в інтерфейсі, але загальне враження позитивне.",
    rating: 4,
    title: "Хороша покупка",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Sergiy",
    text: "Продуктивність хороша навіть у важких задачах, нічого не гальмує.",
    rating: 5,
    title: "Потужний девайс",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Olena",
    text: "Зручний у використанні, швидко підключив і налаштував без проблем.",
    rating: 5,
    title: "Все просто",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Yurii",
    text: "Не сподобалось, що комплект мінімальний, але сам продукт працює чудово.",
    rating: 4,
    title: "Є нюанси",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Vlad",
    text: "Після старого пристрою різниця дуже помітна. Все працює значно швидше і комфортніше.",
    rating: 5,
    title: "Відчутний апгрейд",
    link: "https://comfy.ua/ua/"
    },
    {
    user: "Ira",
    text: "Користуюсь вже місяць, все працює стабільно, особливо подобається швидкість реакції системи.",
    rating: 5,
    title: "Стабільний і швидкий",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Artem",
    text: "Нормальний пристрій, але за таку ціну очікував трохи кращу камеру і автономність.",
    rating: 4,
    title: "Є куди рости",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Nazar",
    text: "Дуже зручний у щоденному використанні, швидко звик до інтерфейсу.",
    rating: 5,
    title: "Зручний у всьому",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Alina",
    text: "Загалом хороший досвід, але іноді помітні дрібні підлагування в важких додатках.",
    rating: 4,
    title: "Майже ідеально",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Roman",
    text: "Якість збірки на високому рівні, відчувається преміальний продукт.",
    rating: 5,
    title: "Якісна збірка",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Maksym",
    text: "Працює без проблем, але хотілось би трохи кращу оптимізацію батареї.",
    rating: 4,
    title: "Добрий варіант",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Tetiana",
    text: "Сподобався дизайн і екран, дуже приємно користуватись щодня.",
    rating: 5,
    title: "Естетичний і зручний",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Bogdan",
    text: "Середній досвід: нічого критичного, але й вау-ефекту немає.",
    rating: 3,
    title: "Середній рівень",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Viktor",
    text: "Добре підходить для роботи і мультимедіа, все відкривається швидко.",
    rating: 5,
    title: "Для роботи топ",
    link: "https://comfy.ua/ua/"
    },

    {
    user: "Lena",
    text: "Є дрібні недоліки, але загальне враження позитивне, користуватись комфортно.",
    rating: 4,
    title: "Комфортний у використанні",
    link: "https://comfy.ua/ua/"
    }
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function insertReview(review, productId, productName, ai) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO reviews (
        productId,
        productName,
        user,
        date,
        rating,
        sentiment,
        title,
        link,
        text,
        summary,
        pros,
        cons,
        upvotes,
        downvotes,
        commentsCount,
        source
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)
      `,
      [
        productId,
        productName,
        review.user,
        new Date().toISOString(),
        review.rating,
        ai.sentiment,
        review.title,
        review.link,
        review.text,
        ai.summary,
        JSON.stringify(ai.pros),
        JSON.stringify(ai.cons),
        "seed-ai"
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

async function seed() {
  console.log("Seeding clean reviews...");

  for (const productName of products) {
    const productId = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM products WHERE name = ?",
        [productName],
        (err, row) => {
          if (err) return reject(err);

          if (row) return resolve(row.id);

          db.run(
            "INSERT INTO products (name, rating, trend) VALUES (?, 0, 'up')",
            [productName],
            function (err) {
              if (err) reject(err);
              else resolve(this.lastID);
            }
          );
        }
      );
    });

    for (let i = 0; i < 10; i++) {
      const base = random(reviewsPool);

      // 🔥 AI ANALYSIS STEP (ключова частина)
      const ai = await analyzeReview(base.text, base.rating);

      await insertReview(base, productId, productName, ai);
    }
  }

  console.log("Done seeding");
  process.exit(0);
}

seed();