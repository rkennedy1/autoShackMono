import { RotatingLines } from "react-loader-spinner";

interface Props {
  name: string;
}

const Loading: React.FC<Props> = ({ name }) => {
  return (
    <div style={{ margin: "10vh" }} id={`loading-${name}-component`}>
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
