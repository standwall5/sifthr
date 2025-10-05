import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-div">
        <h1>Members</h1>
        <ul>
          <li>John Patrick Salen</li>
          <li>Carl Jaizon Rey Mercado</li>
          <li>Alih Marfil</li>
        </ul>
      </div>
      <div className="footer-div">
        <h1>Made in Compliance with</h1>
        <p>
          Capstone Project I in <br />
          The Polytechnic University of the Philippines
        </p>
      </div>
      <div className="brand-icon">
        <a href="#">
          <img src="/assets/images/logoModuleFinal.png" alt="" />
          <h1>
            Sif<span>thr</span>
          </h1>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
