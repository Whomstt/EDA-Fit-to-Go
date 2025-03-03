"use client";

import React, { useState, useEffect } from "react";

const apiBase = "http://localhost:8080/api/post";

const fetchCount = async (field: string): Promise<number> => {
  try {
    const response = await fetch(`${apiBase}/count/${field}`);
    return response.ok ? await response.json() : 0;
  } catch {
    console.error(`Error fetching ${field} count`);
    return 0;
  }
};

const incrementCount = async (
  field: string,
  setCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>
): Promise<void> => {
  try {
    const response = await fetch(`${apiBase}/increment/${field}`, { method: "POST" });
    if (response.ok) {
      setCounts((prev) => ({ ...prev, [field]: prev[field] + 1 }));
    }
  } catch {
    console.error(`Error incrementing ${field}`);
  }
};

export default function Home() {
  const [counts, setCounts] = useState<Record<string, number>>({ likes: 0, comments: 0, shares: 0 });

  useEffect(() => {
    const fields = ["likes", "comments", "shares"];
    Promise.all(fields.map(fetchCount)).then(([likes, comments, shares]) =>
      setCounts({ likes, comments, shares })
    );
  }, []);

  const colors: Record<string, string> = { likes: "blue", comments: "green", shares: "purple" };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {Object.entries(counts).map(([field, value]) => (
        <div key={field} className="mb-4">
          <p className="text-xl text-black capitalize">
            {field}: {value}
          </p>
          <button
            onClick={() => incrementCount(field, setCounts)}
            className={`px-4 py-2 text-white bg-${colors[field]}-500 rounded hover:bg-${colors[field]}-600`}
          >
            Increment {field}
          </button>
        </div>
      ))}
    </main>
  );
}
