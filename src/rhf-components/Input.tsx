import ErrorMessage from "./ErrorMessage";
import { ReactHookFormComponentProps } from "./react-hook-form-types";
import { Controller } from "react-hook-form";

export interface InputPropsInterface extends ReactHookFormComponentProps {
  type?:
    | "date"
    | "time"
    | "datetime-local"
    | "password"
    | "color"
    | "email"
    | "number"
    | "search"
    | "tel"
    | "text"
    | "url";
}

const Input = (props: InputPropsInterface) => {
  const { label, name, control, errors, ...rest } = props;
  const isInvalid = !!errors[name];

  return (
    <div>
      {!!label && (
        <label className="pb-3" htmlFor={name}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            {...field}
            {...rest}
            className={`shadow appearance-none ${
              isInvalid ? "border-red-500" : "border"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
        )}
      />
      {isInvalid && (
        <ErrorMessage>{errors[name]?.message as string}</ErrorMessage>
      )}
    </div>
  );
};

export default Input;
