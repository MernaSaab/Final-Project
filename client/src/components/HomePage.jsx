import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import "../styles/HomePage.css";

export default function HomePage() {
  const [dailyTip, setDailyTip] = useState("");
  const [result, setResult] = useState("");
  const [form, setForm] = useState({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    activity: "1.2",
  });

  useEffect(() => {
    const tips = [
      "🚶 אל תוותרו על תנועה – אפילו הליכה של 10 דקות עושה הבדל",
      "🍽️ הקפידו לאכול לאט – זה עוזר לתחושת שובע",
      "💤 שינה טובה חשובה יותר מתפריט מושלם",
      "🥦 נסו להוסיף ירקות לארוחות שאתם הכי אוהבים",
      "📱 תתנתקו מהטלפון בזמן הארוחה – ותיהנו מהאוכל באמת",
      "💧 התחילו כל בוקר בכוס מים – פשוט, אבל אפקטיבי",
      "🍫 חשק למתוק? קוביית שוקולד מריר יכולה לסגור את הפינה",
      "💡 שינוי קטן כל יום – מביא לתוצאה גדולה לאורך זמן",
      "🧘 קחו הפסקות נשימה קצרות במהלך היום – זה מרגיע ומאזן",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const handleCalorieSubmit = (e) => {
    e.preventDefault();
    const { gender, age, height, weight, activity } = form;

    const ageNum = parseInt(age);
    const heightNum = parseInt(height);
    const weightNum = parseFloat(weight);
    const activityNum = parseFloat(activity);

    let bmr;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const tdee = Math.round(bmr * activityNum);
    setResult(`צריכת קלוריות יומית מוערכת: ${tdee} קלוריות ליום`);
  };

  return (
    <div>
      <Header />

      <section className="tips-section">
        <h2>💡 טיפים לאורח חיים בריא</h2>
        <div className="tips-grid">
          <div className="tip-card">🥦 התחילו כל ארוחה בירקות – זה משביע ומאזן</div>
          <div className="tip-card">💧 שתו לפחות 8 כוסות מים ביום – גם בלי להרגיש צמא</div>
          <div className="tip-card">🍎 נסו להחליף ממתקים בפירות – גם טעים וגם טבעי</div>
          <div className="tip-card">🥜 חטיף מושלם? חופן אגוזים טבעיים</div>
          <div className="tip-card">🍠 העדיפו דגנים מלאים – הם נשארים איתכם לאורך זמן</div>
          <div className="tip-card">🍋 פתחו את הבוקר עם מים חמימים ולימון – זה מנקה ומעורר</div>
          <div className="tip-card">🥗 הכינו סלט עם כל הצבעים – ככל שיותר צבע, יותר בריאות!</div>
          <div className="tip-card">🥤 העדיפו להכין שייק בבית במקום לקנות מיצים עם סוכר מוסף</div>
          <div className="tip-card">🌰 הוסיפו זרעי צ'יה/פשתן לסלט – בוסט של אומגה 3</div>
          <div className="tip-card">🍫 מתחשק משהו מתוק? לכו על בטטה, קינואה, ועדשים</div>
          <div className="tip-card">📝 הירשמו לאתר כדי לקבל תפריט מותאם אישית – בלי לנחש</div>
          <div className="tip-card">🍽️ אין זמן לבשל? תנו לנו להתאים לכם ארוחות מוכנות ובריאות</div>
        </div>
      </section>

      <section className="meal-gallery">
        <h2>🍽️ הצצה למנות הבריאות שלנו</h2>
        <div className="gallery-grid">
          <div className="meal-card">
            <img src="/images/food1.jpg" alt="סלט ירוק טרי" />
            <p>קערת שיק אסאי</p>
          </div>
          <div className="meal-card">
            <img src="/images/food2.jpg" alt="עוף בגריל" />
            <p>סלמון אפוי</p>
          </div>
          <div className="meal-card">
            <img src="/images/food3.jpg" alt="קערת קינואה" />
            <p>סלט חזה עוף</p>
          </div>
        </div>
        <nav>
          <div className="meals-cta">
          <Link to="/meals">לצפייה בכל המנות הבריאות שלנו 🍴</Link>
        </div>
        </nav>
       
      </section>

      <section className="daily-tip">
        <h2>🎯 טיפ יומי</h2>
        <p>{dailyTip}</p>
      </section>

      <section className="calorie-calculator">
        <h2>🔢 מחשבון קלוריות יומי</h2>
        <form onSubmit={handleCalorieSubmit}>
          <label>
            מין:
            <select id="gender" value={form.gender} onChange={handleInputChange}>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </label>
          <label>
            גיל:
            <input type="number" id="age" value={form.age} onChange={handleInputChange} required />
          </label>
          <label>
            גובה (ס"מ):
            <input type="number" id="height" value={form.height} onChange={handleInputChange} required />
          </label>
          <label>
            משקל (ק"ג):
            <input type="number" id="weight" value={form.weight} onChange={handleInputChange} required />
          </label>
          <label>
            רמת פעילות:
            <select id="activity" value={form.activity} onChange={handleInputChange}>
              <option value="1.2">לא פעיל</option>
              <option value="1.375">פעילות קלה (1-3 ימים בשבוע)</option>
              <option value="1.55">פעילות בינונית (3-5 ימים בשבוע)</option>
              <option value="1.725">פעילות גבוהה (6-7 ימים בשבוע)</option>
              <option value="1.9">פעילות עצימה מאוד</option>
            </select>
          </label>
          <button type="submit">חשב</button>
        </form>
        {result && <div className="result">{result}</div>}
      </section>

      <Footer />
    </div>
  );
}

