import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./App.css";
import { useForm } from "react-hook-form";
import Input from "./rhf-components/Input";
import Select from "./rhf-components/Select";
import Radio from "./rhf-components/Radio";
import Checkbox from "./rhf-components/Checkbox";

type DynamicFieldsDataType = {
  id: number;
  questionType: string;
  active: boolean;
  questionText: string;
  additionalLabels: string;
  locale: string;
  answers: { id: number; answerText: string; locale: string }[];
  required: boolean;
  errorMessage: string;
};

type MockyResponseType = {
  dynamicFieldsData: DynamicFieldsDataType[];
};

function App() {
  const [error, setError] = useState("");
  const [radioQuestions, setRadioQuestions] = useState<DynamicFieldsDataType[]>(
    []
  );
  const [checkboxQuestions, setCheckboxQuestions] = useState<
    DynamicFieldsDataType[]
  >([]);

  const initialValues: {
    [key: string]: string | [];
  } = {
    firstName: "",
    lastName: "",
    email: "",
  };
  const validationRules: {
    [key: string]: Yup.Schema;
  } = useMemo(() => ({}), []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://run.mocky.io/v3/8a2c6f8e-09f8-4b18-bbb6-18ecf9c42aae"
      );
      const data: MockyResponseType = await response.json();

      const radioQuestionsResponse = data.dynamicFieldsData.filter(
        (item: { questionType: string }) => item.questionType === "RADIO"
      );

      const checkboxQuestionsResponse = data.dynamicFieldsData.filter(
        (item: { questionType: string }) => item.questionType === "CHECKBOX"
      );

      setRadioQuestions(radioQuestionsResponse);
      setCheckboxQuestions(checkboxQuestionsResponse);

      return response;
    };

    fetchData();
  }, [validationRules]);

  radioQuestions?.forEach((item) => {
    initialValues[item.id.toString()] = "";

    validationRules[item.id.toString()] = Yup.string();

    if (item.required) {
      validationRules[item.id.toString()] = Yup.string().required(
        item.errorMessage
      );
    }
  });
  checkboxQuestions?.forEach((item) => {
    initialValues[item.id.toString()] = [];

    validationRules[item.id.toString()] = Yup.array().of(Yup.string());

    if (item.required) {
      validationRules[item.id.toString()] = Yup.array()
        .of(Yup.string().required(item.errorMessage))
        .min(1, item.errorMessage)
        .required(item.errorMessage);
    }
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is a required field"),
    lastName: Yup.string().required("Last Name is a required field"),
    ...validationRules,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<typeof initialValues>({
    // @ts-expect-error - TS2322: Type 'Yup.ObjectSchema<object>' is not assignable to type 'Schema<Record<string, any>>'.
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      console.log("values", values);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const SELECT_OPTIONS = [
    { key: "Option 1", value: "option1" },
    { key: "Option 2", value: "option2" },
    { key: "Option 3", value: "option3" },
  ];

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-20">
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <p className="font-medium">Error!</p> {error}
        </div>
      )}

      <form
        className=" text-left w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="firstName"
          label="First Name"
          control={control}
          errors={errors}
          placeholder="Enter First Name"
        />

        <Input
          name="lastName"
          label="Last Name"
          control={control}
          errors={errors}
          placeholder="Enter Last Name"
        />

        <Select
          label="Select Issue Topic"
          name="issueTopic"
          options={SELECT_OPTIONS}
          control={control}
          errors={errors}
        />
        {radioQuestions.map((radioItem) => (
          <Radio
            key={radioItem.id}
            label={radioItem.questionText}
            additionalLabels={radioItem.additionalLabels}
            name={radioItem.id.toString()}
            options={radioItem.answers.map((item: { answerText: string }) => ({
              key: item.answerText,
              value: item.answerText,
            }))}
            control={control}
            errors={errors}
          />
        ))}

        {checkboxQuestions.map((checkboxItem) => (
          <Checkbox
            key={checkboxItem.id}
            label={checkboxItem.questionText}
            additionalLabels={checkboxItem.additionalLabels}
            name={checkboxItem.id.toString()}
            options={checkboxItem.answers.map(
              (item: { answerText: string }) => ({
                key: item.answerText,
                value: item.answerText,
              })
            )}
            control={control}
            errors={errors}
          />
        ))}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isSubmitting ? "Loading" : "Button"}
        </button>
      </form>
    </div>
  );
}

export default App;
