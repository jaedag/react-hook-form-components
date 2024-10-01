import ErrorMessage from "./ErrorMessage";
import {
  ReactHookFormComponentProps,
  SelectOptions,
} from "./react-hook-form-types";
import { Controller } from "react-hook-form";

export interface RHFSelectPropsInterface extends ReactHookFormComponentProps {
  defaultOption?: string;
  options: SelectOptions;
}

const Select = (props: RHFSelectPropsInterface) => {
  const { label, name, options, defaultOption, control, errors, ...rest } =
    props;

  const isInvalid = !!errors[name];

  return (
    <div className="mb-2">
      {!!label && (
        <label className="pb-3" htmlFor={name}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            id={name}
            placeholder={defaultOption}
            {...field}
            {...rest}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            {options?.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              );
            })}
          </select>
        )}
      />
      {isInvalid && (
        <ErrorMessage>{errors[name]?.message as string}</ErrorMessage>
      )}
    </div>
  );
};

export default Select;
