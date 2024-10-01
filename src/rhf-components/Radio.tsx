import ErrorMessage from "./ErrorMessage";
import {
  ReactHookFormComponentProps,
  SelectOptions,
} from "./react-hook-form-types";
import { Controller } from "react-hook-form";

export interface RHFRadioPropsInterface extends ReactHookFormComponentProps {
  options: SelectOptions;
}

const Radio = (props: RHFRadioPropsInterface) => {
  const { label, additionalLabels, name, options, control, errors, ...rest } =
    props;

  const isInvalid = !!errors[name];

  return (
    <div className="mb-2">
      {!!label && (
        <label className="pb-3" htmlFor={name}>
          {label}
        </label>
      )}
      {!!additionalLabels && (
        <div>
          <small className="pb-3">{additionalLabels}</small>
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div {...rest}>
            {options?.map((option) => (
              <label key={option.value} className="inline-flex items-center">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  className="form-radio"
                />
                <span className="ml-2">{option.key}</span>
              </label>
            ))}
          </div>
        )}
      />
      {isInvalid && (
        <ErrorMessage>{errors[name]?.message as string}</ErrorMessage>
      )}
    </div>
  );
};

export default Radio;
