import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/use-login";
import { useValidateMutation } from "@/hooks/use-validate";
import { loginRequestSchema } from "@/types/actions/user/login";
import { validateRequestSchema } from "@/types/actions/user/validate";
import { ApiKey, defaultApiKeySchema } from "@/types/apiKey";
import { useUser } from "@clerk/nextjs";
import { Check, X } from 'lucide-react';

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { ZodError } from "zod";
import axios from "axios";

export default function ApiKeyInput() {
  const { user, isLoaded } = useUser();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [apiKeyState, setApiKeyState] = useState<ApiKey>(defaultApiKeySchema);
  const [inputValue, setInputValue] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const isInitializedRef = useRef(false);
  const loginMutation = useLoginMutation();
  const { mutateValidationWithAbort } = useValidateMutation();

  useEffect(() => {
    const initializeUser = async () => {
      if (isLoaded && user && !isInitializedRef.current) {
        if (user?.primaryEmailAddress?.emailAddress) {
          const userId: string = user.id;
          const name: string = user.firstName || "";
          const email: string = user.primaryEmailAddress.emailAddress;

          const loginRequest = loginRequestSchema.parse({
            id: userId,
            name: name,
            email: email,
          });
          await loginMutation.mutateAsync(loginRequest);
        }
        isInitializedRef.current = true;
      }
    };
    initializeUser();
  }, [isLoaded, user]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidating(true);
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Don't validate empty input
    if (!newValue.trim()) {
      return;
    }

    setApiKeyState({
      ...apiKeyState,
      isValid: false // Reset validation state upon any changes
    });

    debounceTimeoutRef.current = setTimeout(() => {
      setApiKeyState({
        ...apiKeyState,
        apiKey: newValue,
      });
      validateApiKey(newValue);

      // Prevent race conditions where loading ends but isValid boolean is not set yet
      setTimeout(() => {
        setIsValidating(false);
      }, 500);
    }, 1500);
  };
  
  const validateApiKey = async (apiKey: string) => {
    if (!user) {
      return;
    }
    const validateRequest = validateRequestSchema.parse({
      id: user.id,
      api_key: apiKey,
    });
    try {
      const validateResponse = await mutateValidationWithAbort(validateRequest);
      setApiKeyState({
        ...apiKeyState,
        isValid: validateResponse.success,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Zod error: ', error.flatten());
      } else if (axios.isCancel(error)) {
        console.log(`Stale request for api key validation was aborted`);
      } else {
        console.error(error);
      }

      setApiKeyState({
        ...apiKeyState,
        isValid: false,
      });
    }
    
  };

  const inputLoadingSpinner = <>
    {loginMutation.isPending ? (
      <div className="absolute inset-0 flex items-center justify-center bg-background border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    ) : null}
  </>

  const validationIcon = <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2">
    {
      apiKeyState.isValid ? (
        <span className="text-green-500">
          <Check/>
        </span>
      ) : isValidating ? (
        <Loader2 className="animate-spin text-muted-foreground" />
      ) : (
        <span className="text-red-500">
          <X />
        </span>
      )
    }
  </div>

  return (
    <div className="relative w-full">
      {inputLoadingSpinner}
      <div>
        <Input
          className="w-full"
          placeholder={loginMutation.isPending ? "" : "Enter API Key"}
          disabled={loginMutation.isPending}
          value={inputValue}
          onChange={handleApiKeyChange}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Enter API Key")}
        />
        {validationIcon}
      </div>
    </div>
  );
}
