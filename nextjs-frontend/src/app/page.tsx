'use client';

import Image from "next/image";
import Button from "../components/Button";

export default function Home() {
  const handleButtonClick = () => {
    alert('Button clicked!');
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
