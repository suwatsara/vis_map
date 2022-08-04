import React, { useState } from 'react';
import { styled, withStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const PositionContainer = styled('div')({
    position: 'absolute',
    zIndex: 1,
    top: '1000px',
    width: '60%',
    left: '20%',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

});

function ShowTable({rows }) {

    console.log(rows)

    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const  minWidth = 100;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <PositionContainer>
            <Paper sx={{ width: '80%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ minWidth}} align="left">Longitude</TableCell>
                                <TableCell style={{ minWidth}} align="right">Latitude</TableCell>
                                <TableCell style={{ minWidth}} align="right">TimeStamp</TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        {row.longitude}
                                    </TableCell>
                                    <TableCell align="right">{row.latitude}</TableCell>
                                    <TableCell align="right">
                                        {(new Date(row.timestamp).toLocaleString())}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>



        </PositionContainer>

    );

}

export default ShowTable;