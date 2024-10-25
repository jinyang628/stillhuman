"use client";

import ApiKeyInput from "@/components/api-key-input";
import Title from "@/components/title";
import { useUser } from "@clerk/nextjs";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [apiKeyInputVisible, setApiKeyInputVisible] = useState<boolean>(false);
  const { user, isLoaded } = useUser();
  const isInitializedRef = useRef(false);

  const onTitleComplete = () => {
    setApiKeyInputVisible(true);
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (isLoaded && user && !isInitializedRef.current) {
        if (user?.primaryEmailAddress?.emailAddress) {
          const email: string = user.primaryEmailAddress.emailAddress;
          const userId: string = user.id;
          const name: string = user.firstName;
        }
      }
    };
    initializeUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user]);

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
