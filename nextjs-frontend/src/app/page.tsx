'use client';

import React from "react";
import Button from "../components/Button";

export default function Home() {
  const handleButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/likes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Likes data:", data);
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
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <Button text="Like" onClick={handleButtonClick} />
    </main>
  );
}
