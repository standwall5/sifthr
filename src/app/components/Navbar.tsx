import React from "react";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li className="brand-icon">
          <a href="/pages/homepage.php">
            <img src="/assets/images/logoModuleFinal.png" alt="" />
            <h1>
              Sif<span>thr</span>
            </h1>
          </a>
        </li>
        <li>
          <a className="nav-link" id="adminButton" href="admin.php">
            Add Content
          </a>
        </li>
        <li>
          <a
            className="nav-link"
            href="/features/learning-module/pages/modules.php"
          >
            Modules
          </a>
        </li>
        <li>
          <a className="nav-link" href="/features/quizzes/pages/quizzes.php">
            Quizzes
          </a>
        </li>
        <li>
          <a className="nav-link" href="quizzes.php">
            Latest News
          </a>
        </li>
        <li>
          <a className="nav-link" href="quizzes.php">
            Support
          </a>
        </li>
        {/* <!-- <li>
      <a href="#" id="dark-mode" className="nav-link">Dark Mode</a>
    </li> --> */}

        <li id="user-icon">
          <a
            className="nav-link"
            href="/features/user-profile/pages/profile.php"
          >
            <img src="/assets/images/userIcon.png" alt="" />
          </a>
        </li>
      </ul>
      <div className="backdrop"></div>
    </nav>
  );
};

export default Navbar;
