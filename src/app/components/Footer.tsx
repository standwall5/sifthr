"use client";

import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="school-info">
          <div className="school-logo">
            <img
              src="/assets/images/logoModuleFinal.png"
              alt="AdEducate Logo"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/logoModuleFinal.png";
              }}
            />
          </div>
          <h2>
            Ad<span>Educate</span>
          </h2>
          <p className="footer-description">
            An interactive learning platform designed to combat misinformation
            through engaging educational modules and quizzes.
          </p>
        </div>

        <div className="school-info">
          <div className="school-logo">
            <img
              src="/assets/images/SNNHS-Logo.jng"
              alt="Sto. Niño National High School Logo"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/SNNHS-Logo.jpg";
              }}
            />
          </div>
          <h2>Sto. Niño National High School</h2>
          <p className="footer-description">
            Website made for Sto. Niño National High School - Parañaque City
          </p>
          <a
            href="https://stoninonhs.depedparanaquecity.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="school-website"
            style={{
              color: "var(--purple)",
            }}
          >
            https://stoninonhs.depedparanaquecity.com/
          </a>
          {/* <div className="social-links">
            <a
              href="https://www.facebook.com/DepEdTayoSNNHS304901"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
