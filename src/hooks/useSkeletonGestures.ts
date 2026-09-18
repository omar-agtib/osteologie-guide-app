import { useMemo, useRef } from "react";
import { PanResponder, type GestureResponderEvent } from "react-native";

type Point = { x: number; y: number };
type Options = {
  onRotate: (dx: number, dy: number) => void;
  onTap?: (point: Point) => void;
  onPinchStart?: (point: Point) => void;
  onPinch?: (scale: number) => void;
  onPinchEnd?: () => void;
};

// Attach these handlers to an empty overlay over the Canvas. All coordinates
// then belong to that same view, on Android as well as iOS.
export function useSkeletonGestures(options: Options) {
  const latest = useRef(options);
  latest.current = options;

  return useMemo(() => {
    let start: Point | null = null;
    let previous: Point | null = null;
    let startedAt = 0;
    let moved = false;
    let hadMultipleTouches = false;
    let pinching = false;
    let initialDistance = 0;
    let fingerId: number | null = null;

    const point = (touch: { locationX: number; locationY: number }): Point => ({
      x: touch.locationX,
      y: touch.locationY,
    });
    const endPinch = () => {
      if (pinching) latest.current.onPinchEnd?.();
      pinching = false;
      initialDistance = 0;
    };
    const update = (event: GestureResponderEvent) => {
      const touches = event.nativeEvent.touches;
      if (touches.length >= 2) {
        hadMultipleTouches = true;
        previous = null;
        fingerId = null;
        const [a, b] = touches;
        const distance = Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
        if (!pinching && distance > 0) {
          pinching = true;
          initialDistance = distance;
          latest.current.onPinchStart?.({
            x: (a.locationX + b.locationX) / 2,
            y: (a.locationY + b.locationY) / 2,
          });
        } else if (initialDistance > 0) {
          latest.current.onPinch?.(distance / initialDistance);
        }
        return;
      }
      endPinch();
      if (touches.length !== 1) return;
      const touch = touches[0];
      const next = point(touch);
      if (start && Math.hypot(next.x - start.x, next.y - start.y) > 8) {
        moved = true;
      }
      // Rebase when a finger is lifted or replaced, preventing rotation jumps.
      if (
        previous &&
        fingerId === touch.identifier &&
        (moved || hadMultipleTouches)
      ) {
        latest.current.onRotate(next.x - previous.x, next.y - previous.y);
      }
      previous = next;
      fingerId = touch.identifier;
    };
    const cancel = () => {
      endPinch();
      start = null;
      previous = null;
      fingerId = null;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        cancel();
        startedAt = Date.now();
        moved = false;
        hadMultipleTouches = false;
        const first = event.nativeEvent.touches[0];
        start = first ? point(first) : point(event.nativeEvent);
        update(event);
      },
      onPanResponderStart: update,
      onPanResponderMove: update,
      onPanResponderEnd: (event) => {
        if (event.nativeEvent.touches.length > 0) update(event);
      },
      onPanResponderRelease: (event) => {
        const end = point(event.nativeEvent);
        if (
          start &&
          !moved &&
          !hadMultipleTouches &&
          Date.now() - startedAt <= 350 &&
          Math.hypot(end.x - start.x, end.y - start.y) <= 8
        ) {
          latest.current.onTap?.(end);
        }
        cancel();
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: cancel,
      onShouldBlockNativeResponder: () => true,
    }).panHandlers;
  }, []);
}
