"use client";

import ApiKeyInput from "@/components/api-key-input";
import Title from "@/components/title";

import { useState } from "react";

export default function Home() {
  const [apiKeyInputVisible, setApiKeyInputVisible] = useState<boolean>(false);

  const onTitleComplete = () => {
    setApiKeyInputVisible(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Title onTitleComplete={onTitleComplete} />
      <div className="flex-1 flex justify-center items-center w-full max-w-screen-xl px-4">
        <div className="flex w-full max-w-[300px] space-x-3">
          {apiKeyInputVisible && <ApiKeyInput />}
        </div>
      </div>
    </div>
  );
}