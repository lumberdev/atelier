import Section from "./Section";

const NavBar = ({ campaign }) => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
        rel="stylesheet"
      />
      <Section>
        <div className="flex flex-col items-center justify-center">
          <h1 style={{ fontFamily: "Pacifico" }} className="text-4xl mx-1 my-8">
            {campaign?.title}
          </h1>
          <nav className="flex flex-row my-8">
            {["Home", "Collections", "About", "Contact"].map((linkTitle) => (
              <a href="/" className="mx-1">
                {linkTitle}
              </a>
            ))}
          </nav>
        </div>
        {/* <div className="flex flex-row items-center justify-center">
          <a href="/" className="">
            <span className="material-symbols-outlined">search</span>
          </a>
          <a href="/" className="">
            <span className="material-symbols-outlined">
              shopping_cart_checkout
            </span>
          </a>
        </div> */}
      </Section>
    </>
  );
};

export default NavBar;
