"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import "./styles.css";

const page = () => {
  const router = useRouter();
  return (
    <>
      {/* <!-- Menu -->
        <!-- Redirect users to new page each time --> */}
      <div className="menu">
        <Link className="box" id="modules" href="/learning-modules">
          <h1>Learning Materials</h1>
          <p>
            This interactive learning module is specifically designed to educate
            individuals, particularly the elderly, about the dangers of social
            media ad scams and how to identify them.
          </p>
          <div className="items">
            <ul>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
            </ul>
          </div>
        </Link>
        <Link className="box" id="quizzes" href="quizzes">
          <h1>Quizzes</h1>
          <p>
            Test your knowledge and reinforce what you've learned about social
            media ad scams. This quiz will help you identify the signs of
            fraudulent ads and ensure you're equipped with the right strategies
            to stay safe online. Ready to challenge yourself?
          </p>
          <div className="items">
            <ul>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
            </ul>
          </div>
        </Link>
        <Link className="box" id="latestNews" href="latest-news">
          <h1>Latest News</h1>
          <p>
            Stay updated with the foregoing dangers present online. The most
            updated information regarding recent social media advertisement and
            online scams.
          </p>
          <div className="items">
            <ul>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
            </ul>
          </div>
        </Link>
        <Link className="box" id="support" href="/support">
          <h1>Support</h1>
          <p>
            Test your knowledge and reinforce what you've learned about social
            media ad scams. This quiz will help you identify the signs of
            fraudulent ads and ensure you're equipped with the right strategies
            to stay safe online. Ready to challenge yourself?
          </p>
          <div className="items">
            <ul>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
              <li>
                <img src="" alt="" />
              </li>
            </ul>
          </div>
        </Link>
      </div>
    </>
  );
};

export default page;

<li>
  <img src="" alt="" />
</li>;
