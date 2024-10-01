const ErrorMessage = ({ children }: { children: string }) => {
  return <p className="text-red-500 text-xs italic py-3">{children}</p>;
};

export default ErrorMessage;
