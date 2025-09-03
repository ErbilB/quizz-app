import headerImg from "./images/adisyonSushiCucumber.webp";

function Header() {
  return (
    <header className="app-header">
      <img src={headerImg} alt="sushi cucumber" />
      <h1>The React Quizz </h1>
    </header>
  );
}

export default Header;
