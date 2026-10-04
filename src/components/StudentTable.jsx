import { useMemo } from "react";
import { tableFeatures, useTable } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Card,
  Table as BootstrapTable,
} from "react-bootstrap";

const features = tableFeatures({});

function StudentTable({ students, onDelete }) {
  const columns = useMemo(
    () => [
      {
        id: "number",
        header: "#",
        cell: ({ row }) =>
          String(row.getDisplayIndex() + 1).padStart(2, "0"),
      },
      {
        id: "student",
        header: "Student",
        accessorFn: (student) =>
          `${student.firstName} ${student.lastName}`,
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: "course",
        header: "Course",
        cell: ({ getValue }) => (
          <Badge bg="primary">{getValue()}</Badge>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        id: "coordinates",
        header: "Coordinates",
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {row.original.latitude.toFixed(5)}
            <br />
            {row.original.longitude.toFixed(5)}
          </span>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(row.original.id)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [onDelete],
  );

  const table = useTable(
    {
      features,
      columns,
      data: students,
    },
    (state) => state,
  );

  return (
    <Card className="mt-4 border-0 shadow-sm sm:mt-6">
      <Card.Header className="border-bottom bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Student Records
            </h2>

            <p className="mb-0 text-sm text-slate-500">
              All registered students.
            </p>
          </div>

          <Badge bg="primary" pill>
            {students.length} {students.length === 1 ? "Record" : "Records"}
          </Badge>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <BootstrapTable responsive hover className="mb-0 align-middle">
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap px-4 py-3">
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-5 text-center text-slate-500"
                >
                  No students have been registered yet.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </BootstrapTable>
      </Card.Body>
    </Card>
  );
}

export default StudentTable;
