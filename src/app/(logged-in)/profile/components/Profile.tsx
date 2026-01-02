"use client";
import React, { useState } from "react";
import MediumCard from "@/app/components/MediumCard";
import { useProfile } from "@/app/(logged-in)/profile/hooks/useProfile";
import { OrbitProgress } from "react-loading-indicators";
import styles from "./Profile.module.css";
import BadgesDisplay from "./BadgesDisplay";
import StreakDisplay from "./StreakDisplay";
import ProfilePictureUpload from "./ProfilePictureUpload";

const Profile = () => {
  const { profile, loading } = useProfile();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  if (loading) {
    return (
      <OrbitProgress dense color="#92e97c" size="medium" text="" textColor="" />
    );
  }

  if (!profile) {
    return <MediumCard>Not signed in</MediumCard>;
  }

  const currentProfilePicture =
    profilePicture ||
    profile.profile_picture_url ||
    "/assets/images/userIcon.png";

  return (
    <div className={styles.profileWrapper}>
      <MediumCard>
        <div className={styles.profileContainer}>
          <div className={styles.avatarContainer}>
            <img
              src={currentProfilePicture}
              alt={profile.name}
              className={styles.avatar}
            />
            <ProfilePictureUpload
              currentImageUrl={currentProfilePicture}
              userId={profile.id}
              onUploadSuccess={(newUrl) => setProfilePicture(newUrl)}
            />
          </div>
          <div className={styles.info}>
            <h1>{profile.name}</h1>
            <h2>{profile.age}</h2>
            <h2>{profile.email}</h2>
          </div>
        </div>
      </MediumCard>

      <MediumCard>
        <div className={styles.summaryContainer}>
          <span className={styles.modulePercent}>
            <span className={styles.percent}>
              {Math.round(profile.completionPercent)}%
            </span>
            <span className={styles.percentText}> of Modules Completed</span>
          </span>
          <span className={styles.modulePercent}>
            <span className={styles.percent}>{profile.letterGrade}</span>
            <span className={styles.percentText}> Overall Quiz Grade</span>
          </span>
        </div>
      </MediumCard>

      {/* Streak Display */}
      <StreakDisplay userId={profile.id} />

      {/* Badges Display */}
      <BadgesDisplay userId={profile.id} />

      <MediumCard>
        <div className={styles.moduleQuizHistoryContainer}>
          <div className={styles.moduleQuizHistory}>
            <h2>Module History</h2>
            {profile.modules.length != 0 ? (
              <ul>
                {profile.modules.map((module) => (
                  <li key={module.id}>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No module history available.</p>
            )}
          </div>
        </div>
      </MediumCard>

      <MediumCard>
        <div className={styles.moduleQuizHistoryContainer}>
          <div className={styles.moduleQuizHistory}>
            <h2>Quiz History</h2>
            {profile.quizzes.length != 0 ? (
              <ul>
                {profile.quizzes.map((quiz) => (
                  <li key={quiz.id}>
                    <h3>{quiz.title}</h3>
                    <p>Average Score: {quiz.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No quiz history available.</p>
            )}
          </div>
        </div>
      </MediumCard>
    </div>
  );
};

export default Profile;
