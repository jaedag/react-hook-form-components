import { render, screen } from "@testing-library/react"
import Radio from "./Radio"
import { FieldErrors, useForm } from "react-hook-form"
import "@testing-library/jest-dom"

interface InitialValues {
  radioTest: string
}

const initialErrors = {
  radioTest: "Initial Radio",
}

const radioOptions = [
  { key: "Option 1", value: "Option 1" },
  { key: "Option 2", value: "Option 2" },
] as unknown as { key: string; value: string }[]

const onSubmit = () => alert("Submitted!")

describe("Radio Component", () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InitialValues>()

  it("renders without crashing", () => {
    render(
      <form onSubmit={handleSubmit(onSubmit)}>
        <Radio
          name="radioTest"
          additionalLabels="Enter some value here"
          options={radioOptions}
          control={control}
          errors={errors}
        />
      </form>
    )
  })

  it("renders a label when passed a label prop", () => {
    render(
      <form onSubmit={handleSubmit(onSubmit)}>
        <Radio
          name="radioTest"
          label="Test Label"
          options={radioOptions}
          control={control}
          errors={errors}
        />
      </form>
    )
    const label = screen.getByText("Test Label")
    expect(label).toBeInTheDocument()
  })

  const customErrors = {
    radioTest: { message: "This is an error message" },
  }

  it("displays error message when there is a form validation error", () => {
    render(
      <form onSubmit={handleSubmit(onSubmit)}>
        <Radio
          name="radioTest"
          placeholder="Enter some value here"
          options={radioOptions}
          control={control}
          errors={customErrors as unknown as FieldErrors<InitialValues>}
        />
      </form>
    )
    const errorMessage = screen.getByText(initialErrors.radioTest)
    expect(errorMessage).toBeInTheDocument()
  })

  it("does not display error message when there is no form validation error", () => {
    render(
      <form onSubmit={handleSubmit(onSubmit)}>
        <Radio
          name="radioTest"
          options={radioOptions}
          control={control}
          errors={errors}
        />
      </form>
    )
    const errorMessage = screen.queryByText(/.+/)
    expect(errorMessage).toBeNull()
  })
})
