import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const mockDonors = [
  { id: 1, name: 'Nguyễn Văn A', bloodType: 'A+', lastDonation: '2024-02-15', status: 'Eligible' },
  { id: 2, name: 'Trần Thị B', bloodType: 'O-', lastDonation: '2024-01-20', status: 'Eligible' },
  { id: 3, name: 'Lê Văn C', bloodType: 'B+', lastDonation: '2023-12-10', status: 'Not Eligible' },
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MedicalCenterDonors() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  const [donors, setDonors] = useState(mockDonors);
  const [open, setOpen] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [form, setForm] = useState({ name: '', bloodType: '', lastDonation: '', status: 'Eligible' });

  const handleOpen = (donor = null) => {
    setEditDonor(donor);
    setForm(donor ? { ...donor } : { name: '', bloodType: '', lastDonation: '', status: 'Eligible' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editDonor) {
      setDonors(donors.map(d => d.id === editDonor.id ? { ...form, id: editDonor.id } : d));
    } else {
      setDonors([...donors, { ...form, id: donors.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setDonors(donors.filter(d => d.id !== id));

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
        {t('medicalCenter.donorManagement') || 'Donor Management'}
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {isAdmin && (
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              {t('medicalCenter.addDonor') || 'Add Donor'}
            </Button>
          )}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('medicalCenter.name') || 'Name'}</TableCell>
                  <TableCell>{t('medicalCenter.bloodType') || 'Blood Type'}</TableCell>
                  <TableCell>{t('medicalCenter.lastDonation') || 'Last Donation'}</TableCell>
                  <TableCell>{t('medicalCenter.status') || 'Status'}</TableCell>
                                      {isAdmin && <TableCell align="right">{t('medicalCenter.actions') || 'Actions'}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell>{donor.name}</TableCell>
                    <TableCell>{donor.bloodType}</TableCell>
                    <TableCell>{donor.lastDonation}</TableCell>
                    <TableCell>
                      <Chip label={t(`medicalCenter.status_${donor.status.toLowerCase().replace(' ', '')}`) || donor.status} color={donor.status === 'Eligible' ? 'success' : 'error'} size="small" />
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(donor)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(donor.id)}><Delete /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {isAdmin && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editDonor ? t('medicalCenter.editDonor') || 'Edit Donor' : t('medicalCenter.addDonor') || 'Add Donor'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label={t('medicalCenter.name') || 'Name'} name="name" value={form.name} onChange={handleChange} fullWidth />
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('medicalCenter.bloodType') || 'Blood Type'}</InputLabel>
            <Select
              label={t('medicalCenter.bloodType') || 'Blood Type'}
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
            >
              {bloodTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField 
            margin="dense" 
            label={t('medicalCenter.lastDonation') || 'Last Donation'} 
            name="lastDonation" 
            type="date"
            value={form.lastDonation} 
            onChange={handleChange} 
            fullWidth 
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('medicalCenter.status') || 'Status'}</InputLabel>
            <Select
              label={t('medicalCenter.status') || 'Status'}
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="Eligible">{t('medicalCenter.status_eligible') || 'Eligible'}</MenuItem>
              <MenuItem value="Not Eligible">{t('medicalCenter.status_noteligible') || 'Not Eligible'}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('medicalCenter.cancel') || 'Cancel'}</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editDonor ? t('medicalCenter.save') || 'Save' : t('medicalCenter.add') || 'Add'}</Button>
        </DialogActions>
        </Dialog>
      )}
    </Container>
  );
} 