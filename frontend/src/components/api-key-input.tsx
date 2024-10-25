import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ApiKeyInput() {
  return (
    <>
      <Input
        className="w-full"
        placeholder="Enter API Key"
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "Enter API Key")}
      />
      <Button type="submit">Submit</Button>
    </>
  );
}
