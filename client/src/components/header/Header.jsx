import classes from "./header.module.css";
import "../../styles/HomePage.css";
import Navbar from "../Navbar";

/**
 * description: Header component
 * @returns JSX of component
 */
function Header() {
  return (
    <header className={classes.header}>
      <div className="logo"></div>
      <Navbar />
      <section className="hero">
        <div className="hero-text">
          <h1 className="main-title">הדרך הבריאה והטעימה לחיים טובים</h1>
          <p className="subtitle">
            הצטרפו אלינו וגלו מנות שיגרמו לכם להרגיש מעולה – בכל ביס
          </p>
          <a href="signUp.html" className="cta-btn">
            התחילו עכשיו
          </a>
        </div>
        <div className="logo-text">
          Healthy Lifestyle By <span>melana</span>
        </div>
      </section>
    </header>
  );
}

export default Header;
