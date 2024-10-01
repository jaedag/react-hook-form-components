import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import {
  ReactHookFormComponentProps,
  SelectOptions,
} from "./react-hook-form-types";
import { Controller } from "react-hook-form";

export interface RHFRadioPropsInterface extends ReactHookFormComponentProps {
  options: SelectOptions;
}

const DynamicRadio = (props: RHFRadioPropsInterface) => {
  const { label, name, options, control, errors, ...rest } = props;

  const isInvalid = !!errors[name];

  const [radioQuestions, setRadioQuestions] = useState({});

  // fetch data from api
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://run.mocky.io/v3/8a2c6f8e-09f8-4b18-bbb6-18ecf9c42aae"
      );
      const data = await response.json();

      const radioQuestionsResponse = data.dynamicFieldsData.filter(
        (item: { questionType: string }) => item.questionType === "RADIO"
      );

      setRadioQuestions(radioQuestionsResponse[0]);

      return response;
    };

    fetchData();
  }, []);

  return (
    <div className="mb-2">
      {!!label && (
        <label className="pb-3" htmlFor={name}>
          {radioQuestions.questionText}
        </label>
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
        <ErrorMessage>{radioQuestions.errorMessage as string}</ErrorMessage>
      )}
    </div>
  );
};

export default DynamicRadio;
