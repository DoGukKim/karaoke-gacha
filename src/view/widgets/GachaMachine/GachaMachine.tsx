import cn from '@/shared/lib/cn';
import { GachaMachineHero } from './GachaMachineHero';
import { cva, type VariantProps } from 'class-variance-authority';

const machineVariants = cva('h-full flex items-center justify-center', {
  variants: {
    size: {
      small: 'w-[60%]',
      medium: 'w-[80%]',
      large: 'w-full',
    },
    state: {
      floating: 'animate-float',
      shake: 'animate-shake',
      loading: 'animate-none',
    },
  },
  defaultVariants: {
    size: 'medium',
    state: 'floating',
  },
});

const shadowVariants = cva('h-4 w-[50%] rounded-[50%] bg-black/50 blur-sm mb-5', {
  variants: {
    isLoading: {
      false: 'animate-shadow',
      true: 'animate-none opacity-35',
    },
  },
  defaultVariants: { isLoading: false },
});

type GachaMachineProps = VariantProps<typeof machineVariants> & {
  isLoading?: boolean;
};

export function GachaMachine({ size, state, isLoading }: GachaMachineProps) {
  const effectiveState = isLoading ? 'shake' : state;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className={cn(machineVariants({ size, state: effectiveState }))}>
        <GachaMachineHero
          className="h-auto w-full object-contain"
          sizes="(max-width: 640px) 100vw, 384px"
          width={400}
          height={500}
          preload
        />
      </div>

      <div className={cn(shadowVariants({ isLoading }))} />
    </div>
  );
}
