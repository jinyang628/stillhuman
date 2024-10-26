"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenerateMutation } from "@/hooks/use-generate";
import { generateRequestSchema } from "@/types/actions/message/generate";
import { ApiKey } from "@/types/data/apiKey";
import { useState } from "react";

type GenerateSectionProps = {
  apiKeyData: ApiKey;
};

export default function GenerateSection({ apiKeyData }: GenerateSectionProps) {
  const [url, setUrl] = useState<string>("");
  const generateMutation = useGenerateMutation();

  const generateNotes = async () => {
    const generateRequest = generateRequestSchema.parse({
      api_key: apiKeyData.apiKey,
      url: url,
    });
    const response = await generateMutation.mutateAsync(generateRequest);
    console.log(response);
  };

  return (
    <div className="flex justify-center w-full space-x-3">
      <Input
        type="url"
        onChange={(e) => setUrl(e.target.value)}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "Enter Claude URL")}
      />
      <Button
        disabled={!apiKeyData.isValid || url.length === 0}
        onClick={generateNotes}
      >
        Generate
      </Button>
    </div>
  );
}
