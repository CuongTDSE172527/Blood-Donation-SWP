import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

const About = () => {
  const { t } = useTranslation();
  const howItWorks = t('about.howItWorks', { returnObjects: true });

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
    <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, textDecoration: 'underline', textUnderlineOffset: 8, color: '#d32f2f', letterSpacing: -1 }}
        >
          {t('about.title')}
        </Typography>
        <Paper elevation={3} sx={{ bgcolor: '#fff', borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: cardShadow }}>
          {/* Mission */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FavoriteIcon sx={{ color: '#d32f2f', mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#d32f2f' }}>{t('about.missionTitle')}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>{t('about.mission')}</Typography>

          {/* How It Works */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon sx={{ color: '#d32f2f', mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#d32f2f' }}>{t('about.howItWorksTitle')}</Typography>
          </Box>
          <List sx={{ mb: 4 }}>
            {Array.isArray(howItWorks) && howItWorks.map((step, idx) => (
              <ListItem key={idx} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary={step} sx={{ color: 'text.secondary' }} />
              </ListItem>
            ))}
          </List>

          {/* Impact */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ color: '#d32f2f', mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#d32f2f' }}>{t('about.impactTitle')}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>{t('about.impact')}</Typography>

          {/* Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmojiEmotionsIcon sx={{ color: '#d32f2f', mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#d32f2f' }}>{t('about.teamTitle')}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>{t('about.team')}</Typography>

          {/* Contact */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ContactSupportIcon sx={{ color: '#d32f2f', mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#d32f2f' }}>{t('about.contactTitle')}</Typography>
      </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>{t('about.contact')}</Typography>
        </Paper>
    </Container>
    </Box>
  );
};

export default About; 