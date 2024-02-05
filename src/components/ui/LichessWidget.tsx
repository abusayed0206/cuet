// components/LichessProfile.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaUser,
  FaChess,
  FaTrophy,
  FaExternalLinkAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";

interface ProfileData {
  profile: {
    username: string;
    bio: string;
    url: string;
    online: boolean;
    perfs: {
      classical: {
        url: string;
      };
    };
    count: {
      tournaments: number;
    };
  };
}

const LichessProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get<ProfileData>(
          "https://lichess.org/api/user/abusayed0206"
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      {profileData !== null ? (
        <div>
          <h2>{profileData.profile.username}</h2>
          <p>{profileData.profile.bio}</p>
          <div>
            {" "}
            <a
              href={profileData.profile.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Profile
            </a>
          </div>
          {profileData.profile.perfs && profileData.profile.perfs.classical && (
            <div>
              <FaExternalLinkAlt />{" "}
              <a
                href={profileData.profile.perfs.classical.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Classical Stats
              </a>
            </div>
          )}
          {profileData.profile.count && (
            <div>
              <FaChalkboardTeacher /> Tournaments:{" "}
              {profileData.profile.count.tournaments}
            </div>
          )}
          {/* Add more information and icons as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LichessProfile;
