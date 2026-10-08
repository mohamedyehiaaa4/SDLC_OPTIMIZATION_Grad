import Image from "next/image";

export default function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/brand-icon.png"
      alt="RepoMind"
      width={size}
      height={size}
      className="shrink-0 rounded-[9px]"
      priority
    />
  );
}
