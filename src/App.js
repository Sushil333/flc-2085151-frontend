import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 0.8,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const flexBetween = {
  margin: "3em 0em 1em 0em",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState(null);
  const [snackOpen, snackSetOpen] = React.useState(false);

  const snackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    snackSetOpen(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function getData() {
    fetch("https://flc-2085151-api.herokuapp.com")
      .then((res) => res.json())
      .then((data) => setRows(data.data))
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    getData()
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const startDate = e.target.startDate.value;
    const endDate = e.target.endDate.value;
    const description = e.target.description.value;

    createData({ startDate, endDate, description })
  }

  function createData(data) {
    fetch("https://flc-2085151-api.herokuapp.com/create/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        handleClose();
        getData();
      })
      .catch(err => console.log(err))
  }

  function handleDelete(id) {
    fetch("https://flc-2085151-api.herokuapp.com/delete/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
      .then(res => {
        snackSetOpen(true);
        getData();
      })
      .catch(err => console.log(err))
  }

  return (
    <Container>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={snackOpen} autoHideDuration={6000} onClose={snackClose}>
        <Alert onClose={snackClose} severity="success" sx={{ width: '100%' }}>
          Deleted Successfully
        </Alert>
      </Snackbar>
      <div style={flexBetween}>
        <h3>Time Logs</h3>

        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleOpen}
        >
          +Add Log
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Start date</TableCell>
              <TableCell align="right">End date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows && (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {rows && rows.length <= 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  No records found!
                </TableCell>
              </TableRow>
            ) : (
              rows &&
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.description}
                  </TableCell>
                  <TableCell align="right">{row.startDate}</TableCell>
                  <TableCell align="right">{row.endDate}</TableCell>
                  <TableCell align="right">
                    <IconButton component="span" onClick={() => handleDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add new record
            </Typography>

            <TextField
              id="datetime-local-1"
              label="Start date"
              type="datetime-local"
              name="startDate"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <TextField
              id="datetime-local-2"
              label="End date"
              type="datetime-local"
              name="endDate"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <TextField id="outlined-basic" name="description" label="Outlined" variant="outlined" required />

            <Button variant="contained" color="primary" type="submit" disableElevation>Submit</Button>
          </Box>
        </form>
      </Modal>
    </Container>
  );
}
