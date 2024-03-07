import { RotatingLines } from "react-loader-spinner";

const Loading: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div style={{ margin: "10vh" }} id={`loading-${name}`}>
      <RotatingLines
        visible={true}
        width="96"
        strokeWidth="5"
        strokeColor="grey"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Loading;
