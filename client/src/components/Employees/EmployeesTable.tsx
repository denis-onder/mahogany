import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { User } from "../../domain/User";
import { Button } from "@mui/material";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  employees: Array<User>;
  onDeleteEmployeeClick: (employee: User) => void;
}

export default function EmployeesTable({
  employees,
  onDeleteEmployeeClick,
}: Props) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell>
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.status ? "Active" : "Inactive"}</TableCell>
              <TableCell align="center">
                <Button size="small" color="success">
                  Assign
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => navigate(`/employee/${employee._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onDeleteEmployeeClick(employee)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}
