import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, TextField, Switch, FormControlLabel } from '@mui/material';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    maintenance: false,
    systemName: 'Blood Donation System',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // Mock save
    alert('Settings saved!');
  };

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>System Settings</Typography>
        <Card>
          <CardContent>
            <TextField label="System Name" name="systemName" value={settings.systemName} onChange={handleChange} fullWidth sx={{ mb: 3 }} />
            <FormControlLabel
              control={<Switch checked={settings.notifications} onChange={handleChange} name="notifications" />}
              label="Enable Notifications"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Switch checked={settings.maintenance} onChange={handleChange} name="maintenance" />}
              label="Maintenance Mode"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" sx={{ bgcolor: '#d32f2f' }} onClick={handleSave}>Save Settings</Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 