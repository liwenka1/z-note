import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";

interface DescFieldProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function DescField({ value, onChange, autoFocus, disabled }: DescFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="desc">描述</Label>
      <Input
        id="desc"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="记录描述"
        autoFocus={autoFocus}
        disabled={disabled}
      />
    </div>
  );
}

interface ContentFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
}

export function ContentField({ value, onChange, rows = 4, disabled }: ContentFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">内容</Label>
      <Textarea
        id="content"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="记录内容"
        rows={rows}
        disabled={disabled}
      />
    </div>
  );
}

interface UrlFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function UrlField({ value, onChange, disabled }: UrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="url">链接地址</Label>
      <Input
        id="url"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        disabled={disabled}
      />
    </div>
  );
}
