import * as React from "preact";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";

import "./disc.scss";

const initialPosition = {
  transform: "translate(0px, 0px)"
};

function Disc({
  pole,
  index,
  dispatch,
  parent
}: {
  index: number;
  pole: number;
  dispatch: (action: { item: number; from: number; to: number }) => void;
  parent: React.RefObject<HTMLDivElement>;
}) {
  const [{ transform }, setSpring] = useSpring(() => initialPosition);

  const bind = useDrag(({ last, movement: [movementX, movementY], cancel }) => {
    if (last) {
      const size = parent.current!.clientWidth / 2;
      const offset = Math.round(movementX / size);
      const absOffset = Math.abs(offset);
      const change = absOffset > 4 ? 0 : Math.ceil(absOffset / 2);
      if (change > 0) {
        const to = pole + change * (offset / absOffset);
        dispatch({
          item: index,
          from: pole,
          to
        });
      }
      // Return to open position
      setSpring(initialPosition);
    } else {
      // Move with dragging position
      setSpring({ transform: `translate(${movementX}px, ${movementY}px)` });
    }
  });

  const props = bind();

  return (
    <animated.div
      className={"disc disc-" + index}
      style={{ transform }}
      {...props}
    ></animated.div>
  );
}

function DisabledDisc({ index }: { index: number }) {
  return <div className={"disc disc-" + index}></div>;
}

export { Disc, DisabledDisc };
