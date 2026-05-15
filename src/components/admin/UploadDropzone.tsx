import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/cn";

export function UploadDropzone({ onSelect }: { onSelect: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-3xl border border-dashed bg-white/[0.03] p-8 text-center shadow-soft backdrop-blur transition",
        dragOver ? "border-cfGold/50 bg-cfGold/10" : "border-white/15 hover:border-white/25"
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) onSelect(e.dataTransfer.files);
      }}
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border border-white/10 bg-black/25 text-cfGold">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-semibold text-adminText">Clique para selecionar ou arraste arquivos</p>
      <p className="mt-2 text-xs text-adminTextMuted">Aceita imagens e vídeos. O processamento pode levar alguns minutos.</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        hidden
        onChange={(e) => e.target.files && onSelect(e.target.files)}
      />
    </div>
  );
}

