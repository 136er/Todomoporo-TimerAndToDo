import { useRef } from "react";
import { usePersistFn } from "./usePersistFn";

export interface UseCompositionReturn<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onCompositionStart: React.CompositionEventHandler<T>;
  onCompositionEnd: React.CompositionEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  isComposing: () => boolean;
}

export interface UseCompositionOptions<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

type TimerResponse = ReturnType<typeof setTimeout>;

export function useComposition<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(options: UseCompositionOptions<T> = {}): UseCompositionReturn<T> {
  const {
    onKeyDown: originalOnKeyDown,
    onCompositionStart: originalOnCompositionStart,
    onCompositionEnd: originalOnCompositionEnd,
  } = options;

  const isComposingRef = useRef(false);
  const compositionEndTimerRef = useRef<TimerResponse | null>(null);
  const compositionResetTimerRef = useRef<TimerResponse | null>(null);

  const onCompositionStart = usePersistFn((e: React.CompositionEvent<T>) => {
    if (compositionEndTimerRef.current) {
      clearTimeout(compositionEndTimerRef.current);
      compositionEndTimerRef.current = null;
    }
    if (compositionResetTimerRef.current) {
      clearTimeout(compositionResetTimerRef.current);
      compositionResetTimerRef.current = null;
    }
    isComposingRef.current = true;
    originalOnCompositionStart?.(e);
  });

  const onCompositionEnd = usePersistFn((e: React.CompositionEvent<T>) => {
    // 使用两层 setTimeout 来处理 Safari 浏览器中 compositionEnd 先于 onKeyDown 触发的问题
    compositionEndTimerRef.current = setTimeout(() => {
      compositionResetTimerRef.current = setTimeout(() => {
        isComposingRef.current = false;
      });
    });
    originalOnCompositionEnd?.(e);
  });

  const onKeyDown = usePersistFn((e: React.KeyboardEvent<T>) => {
    // 在 composition 状态下，阻止 ESC 和 Enter（非 shift+Enter）事件的冒泡
    if (
      isComposingRef.current &&
      (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey))
    ) {
      e.stopPropagation();
      return;
    }
    originalOnKeyDown?.(e);
  });

  const isComposing = usePersistFn(() => {
    return isComposingRef.current;
  });

  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing,
  };
}
