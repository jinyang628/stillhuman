import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/use-login";
import { useValidateMutation } from "@/hooks/use-validate";
import { loginRequestSchema } from "@/types/actions/user/login";
import { validateRequestSchema } from "@/types/actions/user/validate";
import { ApiKey, defaultApiKeySchema } from "@/types/apiKey";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ApiKeyInput() {
  const { user, isLoaded } = useUser();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [apiKeyState, setApiKeyState] = useState<ApiKey>(defaultApiKeySchema);
  const isInitializedRef = useRef(false);
  const loginMutation = useLoginMutation();
  const validateMutation = useValidateMutation();

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
    setApiKeyState({
      apiKey: e.target.value,
      isValid: false,
    });

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      validateApiKey();
    }, 1500);
  };

  const validateApiKey = async () => {
    if (!user) {
      return;
    }
    const validateRequest = validateRequestSchema.parse({
      id: user.id,
      api_key: apiKeyState.apiKey,
    });
    const validateResponse =
      await validateMutation.mutateAsync(validateRequest);
    setApiKeyState({
      ...apiKeyState,
      isValid: validateResponse.success,
    });
  };

  return (
    <div className="relative w-full">
      {loginMutation.isPending ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background border rounded-md">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : null}
      <Input
        className="w-full"
        placeholder={loginMutation.isPending ? "" : "Enter API Key"}
        disabled={loginMutation.isPending}
        onChange={handleApiKeyChange}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "Enter API Key")}
      />
    </div>
  );
}
