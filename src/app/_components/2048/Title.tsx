"use client"

import { type CSSProperties, useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import {
  type Animation,
  type AnimationMerge,
  type AnimationMove,
  type AnimationNew,
  AnimationType,
  Direction
} from "~/types"

export interface TitleProps {
  value: number
  animations?: Animation[]
}

function titleTranslate(axis: "X" | "Y", value: number) {
  return `translate${axis}(calc(${value} * (1rem + 100%))`
}

function findAnimation<T extends Animation>(
  animations: Animation[] | undefined,
  type: AnimationType
): T {
  return animations?.find((animation) => animation.type === type) as T
}

const Title: React.FC<TitleProps> = ({ value, animations }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const moveAnimation = useMemo(
    () => findAnimation<AnimationMove>(animations, AnimationType.MOVE),
    [animations]
  )
  const newAnimation = useMemo(
    () => findAnimation<AnimationNew>(animations, AnimationType.NEW),
    [animations]
  )
  const mergeAnimation = useMemo(
    () => findAnimation<AnimationMerge>(animations, AnimationType.MERGE),
    [animations]
  )

  const style = useMemo(() => {
    if (!moveAnimation) {
      return {}
    }

    const value: CSSProperties = {
      transition: "100ms ease-in-out all"
    }

    switch (moveAnimation.direction) {
      case Direction.UP:
        value.transform = titleTranslate("Y", -1 * moveAnimation.value)
        break
      case Direction.DOWN:
        value.transform = titleTranslate("Y", moveAnimation.value)
        break
      case Direction.LEFT:
        value.transform = titleTranslate("X", -1 * moveAnimation.value)
        break
      case Direction.RIGHT:
        value.transform = titleTranslate("X", moveAnimation.value)
        break
    }

    return value
  }, [moveAnimation])

  function titleColor(value: number): string {
    switch (value) {
      case 2:
        return "bg-[#eee4da]"
      case 4:
        return "bg-[#ede0c8]"
      case 8:
        return "bg-[#f2b179]"
      case 16:
        return "bg-[#f59563]"
      case 32:
        return "bg-[#f67c5f]"
      case 64:
        return "bg-[#f65e3b]"
      case 128:
        return "bg-[#edcf72]"
      case 256:
        return "bg-[#edcc61]"
      case 512:
        return "bg-[#edc850]"
      case 1024:
        return "bg-[#edc53f]"
      case 2048:
        return "bg-[#edc22e]"
      default:
        return "bg-[#cdc1b4]"
    }
  }

  if (!isClient) {
    return null // Render nothing on the server
  }

  return (
    <div className="leading-0 relative rounded-md  bg-[#cdc1b4] pb-[100%] text-lg">
      {value !== 0 && (
        <div
          className={twMerge(
            "leading-0 z-9 absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-md bg-[#3c3a32] text-sm font-bold text-black",
            titleColor(value)
            // {
            //   new: !!newAnimation,
            //   merge: !!mergeAnimation
            // }
          )}
          style={style}
        >
          {value}
        </div>
      )}
    </div>
  )
}

export { Title }