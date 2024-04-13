import { useRef, useState } from "react";

export function Controller() {
  const [state, setState] = useState([0, 0]);

  const ref = useRef<HTMLDivElement | null>(null);
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
          //console.log(ref.current?.getBoundingClientRect());
          if (ref.current === null) {
            return;
          }
          const rect = ref.current.getBoundingClientRect();
          const centerX = rect.x + rect.width / 2;
          const centerY = rect.y + rect.height / 2;

          const touchX = event.touches[0].clientX;
          const touchY = event.touches[0].clientY;

          const diffX = touchX - centerX;
          const diffY = touchY - centerY;

          setState([diffX, diffY]);
        }}
        onTouchMove={(event) => {
          //console.log(ref.current?.getBoundingClientRect());
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
