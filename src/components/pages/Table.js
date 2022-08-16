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
    width: '500px',
    top:'750px',
    left: '35%',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '11px'

});

function ShowTable({rows }) {
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const  minWidth = 30, maxWidth = 55;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
        
            <PositionContainer>        
            <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                <TableContainer sx={{maxHeight: 300}}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ minWidth}} align="left">Longitude</TableCell>
                                <TableCell style={{ minWidth}} align="right">Latitude</TableCell>
                                <TableCell style={{ maxWidth}} align="right">TimeStamp</TableCell>


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

        </div>
       
        

    );

}

export default ShowTable;