"use client";

import ApiKeyInput from "@/components/api-key-input";
import Title from "@/components/title";
import { ApiKey } from "@/types/data/apiKey";
import { useApiKeyStore } from "@/types/store/apiKey";

import { useState } from "react";

export default function Home() {
  const [apiKeyInputVisible, setApiKeyInputVisible] = useState<boolean>(false);
  const { apiKeyState, setApiKeyState } = useApiKeyStore();

  const onTitleComplete = () => {
    setApiKeyInputVisible(true);
  };

  const onApiKeyChange = (apiKey: ApiKey) => {
    setApiKeyState(apiKey);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Title onTitleComplete={onTitleComplete} />
      <div className="flex-1 flex justify-center items-center w-full max-w-screen-xl px-4">
        <div className="flex w-full max-w-[300px] space-x-3">
          {apiKeyInputVisible && <ApiKeyInput apiKeyData={apiKeyState} onApiKeyChange={onApiKeyChange} />}
        </div>
      </div>
    </div>
  );
}
