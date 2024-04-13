import { useEffect, useRef, useState } from "react";
import ROSLIB, { Ros } from "roslib";

const MAX_SPEED = 3;

export function Controller({ ros }: { ros: Ros | undefined }) {
  const [state, setState] = useState([0, 0]);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ros) return;
    const cmdVel = new ROSLIB.Topic({
      ros,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    const twist = new ROSLIB.Message({
      linear: {
        x:
          ((state[1] > 0 ? -1 : 1) *
            Math.sqrt(state[1] * state[1] + state[0] * state[0]) *
            MAX_SPEED) /
          75 /
          2,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -Math.atan2(state[0], -state[1]),
      },
    });
    cmdVel.publish(twist);
  }, [ros, state]);
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: 150,
          height: 150,
          background: "#FFBCBE",
          borderRadius: "50%",
        }}
        onTouchStart={(event) => {
          if (ref.current === null) {
            return;
          }
          const rect = ref.current.getBoundingClientRect();
          const centerX = rect.x + rect.width / 2;
          const centerY = rect.y + rect.height / 2;

          const touchX = event.touches[0].clientX;
          const touchY = event.touches[0].clientY;

          const diffX = Math.max(Math.min(touchX - centerX, 75 / 2), -75 / 2);
          const diffY = Math.max(Math.min(touchY - centerY, 75 / 2), -75 / 2);

          setState([diffX, diffY]);
        }}
        onTouchMove={(event) => {
          if (ref.current === null) {
            return;
          }
          const rect = ref.current.getBoundingClientRect();
          const centerX = rect.x + rect.width / 2;
          const centerY = rect.y + rect.height / 2;

          const touchX = event.touches[0].clientX;
          const touchY = event.touches[0].clientY;

          const diffX = Math.max(Math.min(touchX - centerX, 75 / 2), -75 / 2);
          const diffY = Math.max(Math.min(touchY - centerY, 75 / 2), -75 / 2);

          setState([diffX, diffY]);
        }}
        onTouchEnd={() => {
          setState([0, 0]);
        }}
        ref={ref}
      >
        <div
          style={{
            width: 75,
            height: 75,
            background: "#FFA0A0",
            borderRadius: "50%",
            position: "absolute",
            inset: 0,
            margin: "auto",
            transform: `translate3d(${state[0]}px, ${state[1]}px, 0px)`,
          }}
        ></div>
      </div>
    </div>
  );
}
