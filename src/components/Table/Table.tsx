import {
  IconButton,
  Paper,
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ChangeEvent, ReactNode, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { formatToUTC } from "../../helpers/date.helper";
import { Country } from "../../helpers/country.helper";

type TableColumnType =
  | "string"
  | "numeric"
  | "boolean"
  | "date"
  | "country"
  | "image";

export interface TableColumn {
  id: string;
  label: string;
  type: TableColumnType;
}

interface TableProps {
  cols: TableColumn[];
  rows: any[];
  onRowDelete: (id: number) => void;
  onRowUpdate: (id: number) => void;
}

const Table = ({ cols, rows, onRowDelete, onRowUpdate }: TableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getColumnAlign = (type: TableColumnType) => {
    return type === "numeric" ? "right" : "left";
  };

  const renderCell = (value: unknown, type: TableColumnType): ReactNode => {
    if (type === "string" || type === "numeric") {
      return String(value);
    }

    if (type === "date") {
      return formatToUTC(value as string);
    }

    if (type === "country") {
      return (
        <span>
          <ReactCountryFlag countryCode={value as string} />{" "}
          {Country[value as keyof typeof Country]}
        </span>
      );
    }

    if (type === "image") {
      return value ? (
        <img
          src={`data:image/jpeg;base64,${value}`}
          alt="logo"
          style={{ maxWidth: "70px", maxHeight: "50px" }}
        />
      ) : null;
    }

    return value ? "True" : "False";
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <MUITable>
        <TableHead>
          <TableRow>
            {cols.map(({ id, label, type }) => (
              <TableCell key={id} align={getColumnAlign(type)}>
                {label}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlign: "center" }}>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id as string}>
                {cols.map(({ id, type }) => (
                  <TableCell key={id} align={getColumnAlign(type)}>
                    {renderCell(row[id], type)}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    disabled={!row.canEdit}
                    color="secondary"
                    onClick={() => onRowUpdate(row.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    disabled={!row.canDelete}
                    color="error"
                    onClick={() => onRowDelete(row.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </MUITable>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Table;
