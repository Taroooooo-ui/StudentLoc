import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";

const initialFormData = {
  firstName: "",
  lastName: "",
  course: "",
  email: "",
  address: "",
};

const courseOptions = ["BSIT", "BSCS", "BSIS", "BSCpE"];

function StudentForm({ onRegister }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setFeedback(null);
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "Firstname is required.";
    }

    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Lastname is required.";
    }

    if (!formData.course) {
      validationErrors.course = "Please select a course.";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!formData.address.trim()) {
      validationErrors.address = "Address is required.";
    }

    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback(null);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await onRegister({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        course: formData.course,
        email: formData.email.trim(),
        address: formData.address.trim(),
      });

      setFormData(initialFormData);
      setErrors({});
      setFeedback({
        type: "success",
        message: "Student registered successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "danger",
        message:
          error instanceof Error
            ? error.message
            : "Unable to register the student.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full border-0 shadow-sm">
      <Card.Header className="border-bottom bg-white p-4">
        <h2 className="mb-1 text-xl font-bold text-slate-900">
          Student Registration
        </h2>

        <p className="mb-0 text-sm text-slate-500">
          Enter the student&apos;s information and address.
        </p>
      </Card.Header>

      <Card.Body className="p-4">
        {feedback && (
          <Alert variant={feedback.type} className="py-2">
            {feedback.message}
          </Alert>
        )}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="studentFirstName">
            <Form.Label>Firstname</Form.Label>

            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter firstname"
              autoComplete="given-name"
              isInvalid={Boolean(errors.firstName)}
            />

            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="studentLastName">
            <Form.Label>Lastname</Form.Label>

            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter lastname"
              autoComplete="family-name"
              isInvalid={Boolean(errors.lastName)}
            />

            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="studentCourse">
            <Form.Label>Course</Form.Label>

            <Form.Select
              name="course"
              value={formData.course}
              onChange={handleChange}
              isInvalid={Boolean(errors.course)}
            >
              <option value="">Select Course</option>

              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {errors.course}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="studentEmail">
            <Form.Label>Email</Form.Label>

            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@email.com"
              autoComplete="email"
              isInvalid={Boolean(errors.email)}
            />

            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="studentAddress">
            <Form.Label>Address</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Example: Pasay City, Philippines"
              isInvalid={Boolean(errors.address)}
            />

            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>

            <Form.Text className="text-slate-500">
              The address will be converted into coordinates.
            </Form.Text>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  size="sm"
                  className="me-2"
                  aria-hidden="true"
                />
                Locating address...
              </>
            ) : (
              "Register Student"
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default StudentForm;