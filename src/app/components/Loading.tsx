import { OrbitProgress } from "react-loading-indicators";

type LoadingProps = {
  color: string;
  size?: string;
  text?: string;
  textColor?: string;
  style?: React.CSSProperties;
};

export const Loading = ({
  color,
  size,
  text,
  textColor,
  style,
}: LoadingProps) => {
  const orbitSize =
    size === "small" ? "small" : size === "medium" ? "medium" : "large";
  return (
    <OrbitProgress
      dense
      color={color}
      size={orbitSize}
      text={text}
      textColor={textColor}
      style={style}
    />
  );
};

export default Loading;
