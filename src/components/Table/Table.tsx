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
import { nanoid } from "nanoid";
import { Delete, Edit } from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import { formatToUTC } from "../../helpers/date.helper";

type TableColumnType = "string" | "numeric" | "boolean" | "date";

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

  const renderCell = (value: unknown, type: TableColumnType): string => {
    if (type === "string" || type === "numeric") {
      return String(value);
    }

    if (type === "date") {
      return formatToUTC(value as string);
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
            {cols.map(({ label, type }) => (
              <TableCell key={nanoid()} align={getColumnAlign(type)}>
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
              <TableRow key={nanoid()}>
                {cols.map(({ id, type }) => (
                  <TableCell key={nanoid()} align={getColumnAlign(type)}>
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
