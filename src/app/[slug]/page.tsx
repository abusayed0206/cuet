"use client";
import { useEffect } from "react";

const RedirectPage: React.FC = () => {
  useEffect(() => {
    const redirects: Record<string, string> = {
      trakt: "https://trakt.tv/users/lrs",
      mastodon: "https://mastodon.social/@abusayed",
      linkedin: "https://linkedin.com/in/abusayed0206",
      hashnode: "https://hashnode.com/@abusayed",
      github: "https://github.com/abusayed0206",
      twitter: "https://twitter.com/abusayed0206",
      x: "https://twitter.com/abusayed0206",
      facebook: "https://facebook.com/abusayed0206",
      instagram: "https://instagram.com/abusayed0206",
      goodreads: "https://www.goodreads.com/abusayed0206",
      letterboxd: "https://letterboxd.com/abusayed/films",
      film: "https://letterboxd.com/abusayed/",
      // Add more paths and their corresponding URLs here
    };

    const slug = window.location.pathname.split("/").pop();

    if (slug && redirects[slug]) {
      window.location.replace(redirects[slug]);
    } else {
      console.warn(`No redirect found for '${slug}'`);
      window.location.replace("/"); // Redirect to the homepage
    }
  }, []);

  return (
    <div>
      Redirecting to your destination/ আপনার গন্তব্যে পাঠানো হচ্ছে। যদিও আমার
      জীবনে আমি সঠিক গন্তব্যে যেতে পারিনি!
    </div>
  );
};

export default RedirectPage;
