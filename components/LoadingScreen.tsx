import Spinner from "./Spinner";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen ">
      <Spinner />
    </div>
  );
};

export default LoadingScreen;
