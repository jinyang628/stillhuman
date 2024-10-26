import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/use-login";
import { loginRequestSchema } from "@/types/actions/user/login";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function ApiKeyInput() {
  const { user, isLoaded } = useUser();
  const isInitializedRef = useRef(false);
  const loginMutation = useLoginMutation();

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

  console.log(loginMutation.isPending);

  return (
    <>
      <Input
        className="w-full"
        placeholder="Enter API Key"
        disabled={loginMutation.isPending}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "Enter API Key")}
      />
      <Button type="submit">Submit</Button>
    </>
  );
}
