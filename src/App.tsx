import { useState } from "react";
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
  });

  const {
    handleSubmit,
    control,
    watch,
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
    { key: "Select Option 1", value: "option1" },
    { key: "Select Option 2", value: "option2" },
    { key: "Select Option 3", value: "option3" },
  ];

  const RADIO_OPTIONS = [
    { key: "Yes", value: "yes" },
    { key: "No", value: "no" },
  ];

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

        <Radio
          label="Do you have an issue"
          name="issue"
          options={RADIO_OPTIONS}
          control={control}
          errors={errors}
        />

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
