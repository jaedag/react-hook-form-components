import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./App.css";
import { useForm } from "react-hook-form";
import Input from "./rhf-components/Input";
import Select from "./rhf-components/Select";
import Radio from "./rhf-components/Radio";
import Checkbox from "./rhf-components/Checkbox";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  issue: string;
  issueTopic: string;
  issueDescription: string;
  gameConsoles: string[];
  date: Date;
};

function App() {
  const [error, setError] = useState("");
  const [radioQuestions, setRadioQuestions] = useState([]);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    issue: "",
    issueTopic: "",
    issueDescription: "",
    gameConsoles: [],
    date: new Date(),
  };
  const validationRules = useMemo(() => ({}), []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://run.mocky.io/v3/8a2c6f8e-09f8-4b18-bbb6-18ecf9c42aae"
      );
      const data = await response.json();

      const radioQuestionsResponse = data.dynamicFieldsData.filter(
        (item: { questionType: string }) => item.questionType === "RADIO"
      );
      setRadioQuestions(radioQuestionsResponse);

      return response;
    };

    fetchData();
  }, [validationRules]);

  radioQuestions?.map((item) => {
    if (item.required) {
      validationRules[item.id.toString()] = Yup.string().required(
        item.errorMessage
      );
    }

    validationRules[item.id.toString()] = Yup.string();
  });

  console.log("🚀 ~ file: App.tsx:38 ~ validationRules:", validationRules);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is a required field"),
    lastName: Yup.string().required("Last Name is a required field"),
    email: Yup.string().email().required("Email is a required field"),
    issue: Yup.string().required("Issue is a required field"),
    issueTopic: Yup.string().required("Issue Topic is a required field"),
    issueDescription: Yup.string().required(
      "Issue Description is a required field"
    ),
    gameConsoles: Yup.array()
      .of(Yup.string().required())
      .min(1, "At least one game console must be selected")
      .required("Game Consoles is a required field"),
    date: Yup.date().required(),
    ...validationRules,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<typeof initialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      console.log(values);
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

  // const RADIO_OPTIONS = [
  //   { key: "Yes", value: "yes" },
  //   { key: "No", value: "no" },
  // ];

  const CHECKBOX_OPTIONS = [
    { key: "PlayStation", value: "ps" },
    { key: "Xbox", value: "xbox" },
    { key: "Nintendo", value: "nintendo" },
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
            label={radioItem.questionText}
            name={radioItem.id.toString()}
            options={radioItem.answers.map(
              (item: { answerText: string; answerValue: string }) => ({
                key: item.answerText,
                value: item.answerText,
              })
            )}
            control={control}
            errors={errors}
          />
        ))}

        <Checkbox
          label="Select Game Consoles"
          name="gameConsoles"
          options={CHECKBOX_OPTIONS}
          control={control}
          errors={errors}
        />

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
