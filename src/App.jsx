import { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import StudentForm from "./components/StudentForm";
import StudentMap from "./components/StudentMap";
import StudentTable from "./components/StudentTable";

function App() {
  const [students, setStudents] = useState([]);

  const handleRegisterStudent = async (studentData) => {
    const searchParameters = new URLSearchParams({
      q: studentData.address,
      format: "jsonv2",
      limit: "1",
      countrycodes: "ph",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${searchParameters.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        "The location service is unavailable. Please try again.",
      );
    }

    const locations = await response.json();

    if (locations.length === 0) {
      throw new Error(
        "Address not found. Include the city, province, and Philippines.",
      );
    }

    const latitude = Number(locations[0].lat);
    const longitude = Number(locations[0].lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("The returned coordinates are invalid.");
    }

    const newStudent = {
      id: crypto.randomUUID(),
      ...studentData,
      latitude,
      longitude,
    };

    setStudents((currentStudents) => [
      ...currentStudents,
      newStudent,
    ]);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId),
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 py-4 sm:py-6">
      <Container fluid className="max-w-[1800px] px-3 sm:px-6">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 sm:p-5">
            <header>
              <h1 className="mb-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Student Location System
              </h1>

              <p className="mb-4 text-slate-600">
                Register students and view their locations on the map.
              </p>
            </header>

            <section className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
              <p className="mb-1 text-sm font-medium text-slate-500">
                Total Students
              </p>

              <p className="mb-0 text-2xl font-semibold text-slate-900">
                {students.length}
              </p>
            </section>
          </Card.Body>
        </Card>

        <Row className="mt-2 g-4 align-items-stretch">
          <Col lg={8} xl={9}>
            <StudentMap students={students} />
          </Col>

          <Col lg={4} xl={3}>
            <StudentForm onRegister={handleRegisterStudent} />
          </Col>
        </Row>

        <StudentTable
          students={students}
          onDelete={handleDeleteStudent}
        />
      </Container>
    </main>
  );
}

export default App;
