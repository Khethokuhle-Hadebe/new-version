import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

interface JournalPromptProps {
  prompt: string;
}

export default function JournalPrompt({ prompt }: JournalPromptProps) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/70 p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-lavender" strokeWidth={1.8} />

        <p className="nv-eyebrow">Journal prompt</p>
      </div>

      <p className="mt-4 font-heading text-xl leading-snug text-ink">
        {prompt}
      </p>

      <Link
        href="/journal"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-plum/70 transition hover:text-plum"
      >
        Open journal
        <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
      </Link>
    </section>
  );
}
