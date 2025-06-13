
import "../styles/Meals.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";




export default function Meals() {
  const [Meals, setMeals] = useState([]);
  const addToCart = (name, price) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`הוספת את "${name}" לסל הקניות`);
  };
useEffect(() => {
  

  fetch("http://localhost:3001/meals")
    .then((res) => res.json())
    .then((data) => setMeals(data))
    .catch((err) => console.error("שגיאה:", err));
}, []);

  const meals = [
    {
      category: "מנות עיקריות 🍛",
      items: [
        {
          name: "חזה עוף עם בטטה",
          description: "חזה עוף בגריל מוגש עם בטטה אפויה וסלט ירקות",
          calories: 480,
          price: 55,
          image: "/images/meal1.png",
        },
        {
          name: "חזה עוף עם ביצים",
          description: "חזה עוף עם ירקות, שתי ביצים, אבוקדו ושירי",
          calories: 520,
          price: 45,
          image: "/images/meal2.png",
        },
        {
          name: "חזה עוף עם אורז",
          description: "חזה עוף ברוטב לצד אורז חום מלא",
          calories: 530,
          price: 45,
          image: "/images/meal3.png",
        },
        {
          name: "סלט השף",
          description: "סוגי פסטרמות, עגבניות שירי, מלפפונים, ביצים ורוטב הבית",
          calories: 410,
          price: 55,
          image: "/images/meal4.png",
        },
        {
          name: "פאג'יטה חזה",
          description: "חזה עוף עם זיתים שחורים, אורז, אבוקדו, בצל סגול ותירס",
          calories: 590,
          price: 59,
          image: "/images/meal5.png",
        },
        {
          name: "ביף & ברוקולי",
          description: "בשר בקר מוקפץ עם ברוקולי ורוטב סויה",
          calories: 610,
          price: 65,
          image: "/images/meal6.png",
        },
        {
          name: "ארוחת סלמון",
          description: "שתי חתיכות סלמון, אבוקדו, ביצים וירקות",
          calories: 520,
          price: 65,
          image: "/images/salamon.jpg",
        },
        {
          name: "מק & שיז בריאותי",
          description: "פסטה בריאותית עם רטבים דלי קלוריות",
          calories: 560,
          price: 65,
          image: "/images/meal7.png",
        },
      ],
    },
    {
      category: "🥗 סלטים",
      items: [
        {
          name: "ספרינג סלט",
          description: "מלפפון, חצילים, אגוזים",
          calories: 300,
          price: 35,
          image: "/images/meal8.png",
        },
        {
          name: "סלט פסטה",
          description: "פסטה, מנגו, פטריות, פטרוזיליה",
          calories: 370,
          price: 45,
          image: "/images/salad2.png",
        },
        {
          name: "ספרינג רול סלט",
          description: "שרימפס עם ירקות",
          calories: 390,
          price: 55,
          image: "/images/salad3.png",
        },
        {
          name: "סלט חזה עוף",
          description: "שתי חתיכות חזה עוף, תירס, אבוקדו, עגבניות ובצל",
          calories: 190,
          price: 55,
          image: "/images/salad10.jpg",
        },
      ],
    },
    {
      category: "🍰 קינוחים בריאים",
      items: [
        {
          name: "כוס שוקולד",
          description: "בטעם שוקולד עם 25 גרם חלבון",
          calories: 320,
          price: 35,
          image: "/images/chok1.png",
        },
        {
          name: "צלחת תות",
          description: "שייק תות עם 25 גרם חלבון",
          calories: 320,
          price: 55,
          image: "/images/chok111.jpg",
        },
        {
          name: "שוקולד היימס",
          description: "גלידה בטעם שוקולד עם תותים ו־20 גרם חלבון",
          calories: 280,
          price: 29,
          image: "/images/chok2.png",
        },
        {
          name: "קוקיז בריאים",
          description: "3 קוקיז – כל אחד 15 גרם חלבון",
          calories: 330,
          price: 45,
          image: "/images/chok3.png",
        },
        {
          name: "כדורי שיבולת",
          description: "שיבולת שועל אפויה",
          calories: 260,
          price: 35,
          image: "/images/chok4.png",
        },
        {
          name: "קינוח תפוח",
          description: "ממתיקים בטעם תפוח ודבש",
          calories: 250,
          price: 35,
          image: "images/chok6.png",
        },
        {
          name: "גבינה אפויה עם דבש",
          description: "15 גרם חלבון לכל חתיכה",
          calories: 340,
          price: 90,
          image: "/images/chok7.png",
        },
      ],
    },
    {
      category: "🥤 שייקים / משקאות",
      items: [
        {
          name: "אייסד שייק",
          description: "שייק קפה עם 15 גרם חלבון בטעם קפה",
          calories: 130,
          price: 15,
          image: "/images/shek1.png",
        },
        {
          name: "שייק הירוק",
          description: "בטעם נענע, מוגש עם 15 גרם חלבון",
          calories: 120,
          price: 15,
          image: "/images/shek2.png",
        },
        {
          name: "שייק וניל",
          description: "שייק בטעם וניל עם 15 גרם חלבון",
          calories: 140,
          price: 15,
          image: "/images/shek3.png",
        },
        {
          name: "שייק תפוזים",
          description: "שייק בטעם תפוזים עם 15 גרם חלבון",
          calories: 135,
          price: 15,
          image: "/images/shek4.png",
        },
        {
          name: "שייק בלוברי",
          description: "שייק עם אוכמניות, שיבולת שועל ו־15 גרם חלבון",
          calories: 160,
          price: 20,
          image: "/images/shek5.png",
        },
      ],
    },
  ];

  return (
    <div>
      <header>
        <h1>🍴 הזמנת מנות בריאות</h1>
       <nav>
  <Link to="/homepage">דף הבית</Link>
  <Link to="/login">התחברות</Link>
  <Link to="/signup">הרשמה</Link>
  <Link to="/contactus">צור קשר</Link>
</nav>

      </header>

      <main>
        {meals.map((category, i) => (
          <section className="category" key={i}>
            <h2>{category.category}</h2>
            <div className="card-grid">
              {category.items.map((meal, j) => (
                <div className="meal-card" key={j}>
                  <img src={meal.image} alt={meal.name} />
                  <h3>{meal.name}</h3>
                  <p>{meal.description}</p>
                  <p>
                    <strong>קלוריות:</strong> {meal.calories}
                  </p>
                  <p>
                    <strong>₪{meal.price}</strong>
                  </p>
                  <button
                    className="add-to-cart"
                    onClick={() => addToCart(meal.name, meal.price)}
                  >
                    🛒 הוסף לסל
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <p>דף הזמנות מנות</p>
      </footer>
    </div>
  );
  
}