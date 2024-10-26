import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/use-login";
import { useValidateMutation } from "@/hooks/use-validate";
import { loginRequestSchema } from "@/types/actions/user/login";
import { validateRequestSchema } from "@/types/actions/user/validate";
import { ApiKey } from "@/types/data/apiKey";
import { useUser } from "@clerk/nextjs";
import { Check, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { ZodError } from "zod";
import axios from "axios";

type ApiKeyInputProps = {
  apiKeyData: ApiKey;
  onApiKeyChange: (apiKey: ApiKey) => void;
};

export default function ApiKeyInput({
  apiKeyData,
  onApiKeyChange,
}: ApiKeyInputProps) {
  const { user, isLoaded } = useUser();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const isInitializedRef = useRef(false);
  const loginMutation = useLoginMutation();
  const [isInitializing, setIsInitializing] = useState(true);
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
      setIsInitializing(false);
    };
    initializeUser();
  }, [isLoaded, user]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    onApiKeyChange({
      apiKey: newValue,
      isValid: false, // Reset validation state upon any changes
    });

    setIsValidating(true);

    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      validateApiKey(newValue);

      // Prevent race conditions where loading ends but isValid boolean is not set yet
      setTimeout(() => {
        setIsValidating(false);
      }, 500);
    }, 1500);
  };

  const validateApiKey = async (apiKey: string) => {
    if (!user || !apiKey) {
      return;
    }
    const validateRequest = validateRequestSchema.parse({
      id: user.id,
      api_key: apiKey,
    });
    try {
      const validateResponse = await mutateValidationWithAbort(validateRequest);
      onApiKeyChange({
        apiKey: apiKey,
        isValid: validateResponse.success,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Zod error: ", error.flatten());
      } else if (axios.isCancel(error)) {
        console.log(`Stale request for api key validation was aborted`);
      } else {
        console.error(error);
      }

      onApiKeyChange({
        apiKey: apiKey,
        isValid: false,
      });
    }
  };

  const validationIcon = (
    <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2">
      {apiKeyData.isValid ? (
        <span className="text-green-500">
          <Check />
        </span>
      ) : isValidating ? (
        <Loader2 className="animate-spin text-muted-foreground" />
      ) : (
        <span className="text-red-500">
          <X />
        </span>
      )}
    </div>
  );

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-[300px]">
        {isInitializing ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-md">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div>
            <Input
              type="password"
              className="w-full"
              value={apiKeyData.apiKey}
              onChange={handleApiKeyChange}
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "Enter API Key")}
            />
            {validationIcon}
          </div>
        )}
      </div>
    </div>
  );
}
