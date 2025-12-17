import Image, { ImageProps } from "next/image";

type GachaMachineHeroProps = Omit<ImageProps, "src" | "alt">;

export function GachaMachineHero(props: GachaMachineHeroProps) {
  return (
    <Image
      src="https://mngcrknlgmjlnjhgvzjb.supabase.co/storage/v1/object/public/asset/karaoke-gacha-machine.webp"
      alt="Gacha Machine"
      {...props}
    />
  );
}
