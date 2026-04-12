import { Loader2 } from 'lucide-react';

export function LoadingBlock({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      <p className="mt-4 text-sm text-slate-500">{text}</p>
    </div>
  );
}
