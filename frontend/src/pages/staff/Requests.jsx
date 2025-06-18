import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const mockRequests = [
  { id: 1, patient: 'Sarah Wilson', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
  { id: 2, patient: 'Tom Brown', bloodType: 'O-', units: 1, status: 'Approved', date: '2024-03-19' },
  { id: 3, patient: 'Lisa Davis', bloodType: 'B+', units: 3, status: 'Pending', date: '2024-03-18' },
];

export default function Requests() {
  const [requests, setRequests] = useState(mockRequests);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({ patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });

  const handleOpen = (request = null) => {
    setEditRequest(request);
    setForm(request ? { ...request } : { patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editRequest) {
      setRequests(requests.map(r => r.id === editRequest.id ? { ...form, id: editRequest.id } : r));
    } else {
      setRequests([...requests, { ...form, id: requests.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setRequests(requests.filter(r => r.id !== id));

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>Request Management</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              Add Request
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Blood Type</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.patient}</TableCell>
                      <TableCell>{request.bloodType}</TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell>
                        <Chip label={request.status} color={request.status === 'Approved' ? 'success' : 'warning'} size="small" />
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(request)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(request.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editRequest ? 'Edit Request' : 'Add Request'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Patient" name="patient" value={form.patient} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Blood Type" name="bloodType" value={form.bloodType} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Units" name="units" value={form.units} onChange={handleChange} fullWidth type="number" />
            <TextField margin="dense" label="Status" name="status" value={form.status} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Date" name="date" value={form.date} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editRequest ? 'Save' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 