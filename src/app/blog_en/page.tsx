"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Song() {
  // Added schema of Api query to get the data from hashnode.
  const [post, setPosts] = useState<
    {
      node: {
        coverImage: { url: string | null };
        title: string | null;
        brief: string | null;
        url: string | null;
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Just change the URL to yours and you are good to go.
  const query = `query Publication {
    publication(host:"abusayed.hashnode.dev") {
      posts (first:10){
        edges{
          node {
            coverImage {
              url
            },
            title,
            url
          }
        }
      }
    }
  }`;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    var a = result.data.publication.posts.edges;
    setPosts(a);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(178,190,181)]">
      <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 w-full md:w-auto flex justify-center">
        <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
          <Link href="/en" className="px-3 py-1 rounded-full mb-2 md:mb-0">
            Home
          </Link>
          <Link
            href="/about_en"
            className="px-3 py-1 rounded-full mb-2 md:mb-0"
          >
            About
          </Link>
          <Link
            href="/blog_en"
            className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
          >
            Blog
          </Link>
          <Link
            href="/contact_en"
            className="px-3 py-1 rounded-full mb-2 md:mb-0"
          >
            Contact
          </Link>

          <Link href="/blog" className="px-3 py-1 rounded-full mb-2 md:mb-0">
            বাংলা
          </Link>
        </div>
      </nav>
      <Card className="flex items-center justify-center max-w-auto mx-4 bg-grey-800 text-black relative w-full md:w-auto">
        <SkeletonTheme baseColor="#b0c4de" highlightColor="#e0ffff">
          {loading && (
            <div className="p-10 mt-10">
              <Skeleton height={500} count={1} />
            </div>
          )}
          <section className="text-gray-300 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -m-4 justify-center whitespace-break-spaces">
                {post.map((c, index) => (
                  <div className="p-4 md:w-1/3" key={index}>
                    <a
                      href={c.node.url || ""}
                      className="block"
                      target="_blank"
                    >
                      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-all hover:scale-110 ">
                        <Image
                          className="lg:h-48 md:h-36 w-full object-cover object-center"
                          src={c.node.coverImage.url || ""}
                          alt={c.node.title || ""}
                          width={350}
                          height={250}
                        />
                        {loading && <Skeleton width={350} height={250} />}
                        <div className="p-6">
                          <h1 className="title-font text-lg font-medium text-black mb-3">
                            {c.node.title || ""}
                            {loading && <Skeleton count={1} />}
                          </h1>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SkeletonTheme>
      </Card>
    </div>
  );
}
