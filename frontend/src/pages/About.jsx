import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Grid, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventIcon from '@mui/icons-material/Event';

const About = () => {
  const { t } = useTranslation();
  const howItWorks = t('about.howItWorks', { returnObjects: true });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mb: 5 }}>
        <Typography variant="h3" align="center" fontWeight={700} gutterBottom>
          {t('about.title')}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          <FavoriteIcon sx={{ mr: 1, color: 'error.main', verticalAlign: 'middle' }} />
          {t('about.missionTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>{t('about.mission')}</Typography>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          <EventIcon sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
          {t('about.howItWorksTitle')}
        </Typography>
        <List>
          {Array.isArray(howItWorks) && howItWorks.map((step, idx) => (
            <ListItem key={idx}>
              <ListItemIcon><HowToRegIcon color="secondary" /></ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
          <InfoIcon sx={{ mr: 1, color: 'info.main', verticalAlign: 'middle' }} />
          {t('about.impactTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>{t('about.impact')}</Typography>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          <GroupIcon sx={{ mr: 1, color: 'success.main', verticalAlign: 'middle' }} />
          {t('about.teamTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>{t('about.team')}</Typography>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          <EmailIcon sx={{ mr: 1, color: 'secondary.main', verticalAlign: 'middle' }} />
          {t('about.contactTitle')}
        </Typography>
        <Typography variant="body1">{t('about.contact')}</Typography>
      </Paper>
    </Container>
  );
};

export default About; 