'use client';

import React from "react";
import Image from "next/image";
import Button from "../components/Button";

export default function Home() {
  const handleButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/likes", {
        method: "GET", // GET request
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Likes data:", data); // Handle the data as needed
        alert("Data fetched successfully!");
      } else {
        console.error("Error fetching data:", response.statusText);
        alert("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="...">
      <main className="...">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        {/* Other content */}
        <Button text="Click Me" onClick={handleButtonClick} />
      </main>
    </div>
  );
}
