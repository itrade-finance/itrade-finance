import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '12px',
    borderRadius: '1.25em',
    maxWidth: '800px',
    width: '100%',
    justifyContent: 'center',
    marginTop: '20px'
  },
  table: {
    minWidth: 650,
  },
});

export default function SimpleTable(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Leveraged Token</TableCell>
            <TableCell align="right">Leverage</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { (props.rows && props.rows.length > 0) ? (props.rows.map(row => (
            <TableRow key={row.symbol}>
              <TableCell component="th" scope="row">
                {row.symbol}
              </TableCell>
              <TableCell align="right">{row.leverage}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))) : '' }
        </TableBody>
      </Table>
    </Paper>
  );
}
