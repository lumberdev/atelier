import Spinner from "./Spinner";

const LoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Spinner />
    </div>
  );
};

export default LoadingScreen;
