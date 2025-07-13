import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isVi = i18n.language === 'vi';
  const [openCard, setOpenCard] = useState(null);

  const learnCards = [
    { icon: <FavoriteIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: t('home.learnSection.universalDonor') },
    { icon: <BloodtypeIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: t('home.learnSection.bloodInfo') },
    { icon: <EmojiEmotionsIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: t('home.learnSection.advice') },
    { icon: <GroupIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: t('home.learnSection.donationProcess') },
  ];

  const bloodCards = [
    {
      icon: <InfoIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, 
      title: t('home.bloodSection.bloodInfo.title'),
      content: t('home.bloodSection.bloodInfo.content'),
      details: (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Tổng quan nhóm máu */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>{t('home.bloodSection.bloodInfo.mainTypes')}</Typography>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.bloodInfo.mainTypesDesc')}
              </Typography>
            </Box>
            {/* Đặc điểm từng nhóm máu */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>{t('home.bloodSection.bloodInfo.characteristics')}</Typography>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.bloodInfo.characteristicsDesc')}
              </Typography>
            </Box>
            {/* Tỷ lệ phân bố */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>{t('home.bloodSection.bloodInfo.distribution')}</Typography>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.bloodInfo.distributionDesc')}
              </Typography>
            </Box>
            {/* Ý nghĩa lâm sàng */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>{t('home.bloodSection.bloodInfo.clinicalSignificance')}</Typography>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.bloodInfo.clinicalSignificanceDesc')}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    },
    {
      icon: <EventIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, 
      title: t('home.bloodSection.testingPhase.title'),
      content: t('home.bloodSection.testingPhase.content'),
      details: (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.bloodSection.testingPhase.steps')}</Typography>
              </Box>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.testingPhase.stepsDesc')}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.bloodSection.testingPhase.notes')}</Typography>
              </Box>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.testingPhase.notesDesc')}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    },
    {
      icon: <EmojiEmotionsIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, 
      title: t('home.bloodSection.advice.title'),
      content: t('home.bloodSection.advice.content'),
      details: (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Lưu ý */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.bloodSection.advice.notes')}</Typography>
              </Box>
              <Typography component="ul" sx={{ pl: 2, fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.advice.notesDesc').split('\n').map((item, index) => (
                  <li key={index}>{item.replace('• ', '')}</li>
                ))}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
                {t('home.bloodSection.advice.doctorInfo')}
              </Typography>
            </Box>
            {/* Nên */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#388e3c' }}>{t('home.bloodSection.advice.should')}</Typography>
              </Box>
              <Typography component="ul" sx={{ pl: 2, fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.advice.shouldDesc').split('\n').map((item, index) => (
                  <li key={index}>{item.replace('• ', '')}</li>
                ))}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
                {t('home.bloodSection.advice.doctorInfo')}
              </Typography>
            </Box>
            {/* Không nên */}
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CancelIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.bloodSection.advice.shouldNot')}</Typography>
              </Box>
              <Typography component="ul" sx={{ pl: 2, fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.advice.shouldNotDesc').split('\n').map((item, index) => (
                  <li key={index}>{item.replace('• ', '')}</li>
                ))}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
                {t('home.bloodSection.advice.doctorInfo')}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    },
    {
      icon: <ContactSupportIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, 
      title: t('home.bloodSection.donationProcess.title'),
      content: t('home.bloodSection.donationProcess.content'),
      details: (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.bloodSection.donationProcess.steps')}</Typography>
              </Box>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.donationProcess.stepsDesc')}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.bloodSection.donationProcess.notes')}</Typography>
              </Box>
              <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                {t('home.bloodSection.donationProcess.notesDesc')}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    },
  ];

  const sectionBg = '#fff5f5';
  const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
  const cardRadius = 3;

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 0 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ bgcolor: '#fff', borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: cardShadow }}>
                <Typography variant="h2" fontWeight={700} sx={{ mb: 2, textAlign: 'center', fontSize: { xs: 28, md: 40 }, color: '#d32f2f', letterSpacing: -1 }}>
                  {t('home.hero.title')}
              </Typography>
                <Typography variant="body1" sx={{ mb: 5, textAlign: 'center', fontSize: { xs: 16, md: 20 }, color: 'text.secondary' }}>
                  {t('home.hero.subtitle')}
              </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                      px: 5, py: 1.5, fontWeight: 700, borderRadius: 3, fontSize: 20,
                      background: 'linear-gradient(90deg, #d32f2f 60%, #ff7961 100%)',
                      color: '#fff',
                      boxShadow: '0 2px 8px 0 rgba(211,47,47,0.15)',
                      transition: 'transform 0.15s',
                      '&:hover': { background: 'linear-gradient(90deg, #b71c1c 60%, #ff7961 100%)', transform: 'scale(1.04)' }
                    }}
                    onClick={() => navigate('/register')}
                >
                    {t('home.hero.registerButton')}
                </Button>
              </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ bgcolor: '#fff', borderRadius: 4, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: cardShadow }}>
              <Box
                component="img"
                src="/images/blood-donation-hero.jpg"
                alt="Blood Donation"
                  sx={{ width: '100%', maxWidth: 280, height: 'auto', display: 'block', borderRadius: 2 }}
              />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section: Tìm hiểu về hiến máu */}
      <Box sx={{ bgcolor: sectionBg, py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32, mr: 1 }} />
            <Typography variant="h4" fontWeight={700} sx={{ textDecoration: 'underline', textUnderlineOffset: 8, fontSize: { xs: 22, md: 30 }, color: '#d32f2f', letterSpacing: -0.5 }}>
              {t('home.learnSection.title')}
        </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {learnCards.map((card, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper elevation={2} sx={{ bgcolor: '#fff', borderRadius: cardRadius, p: 3, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: cardShadow }}>
                  {card.icon}
                  <Typography fontWeight={600} sx={{ mt: 1, fontSize: 18, color: '#d32f2f' }}>{card.title}</Typography>
                </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      {/* Section: Nhóm Máu và Tính Tương Thích */}
      <Box sx={{ bgcolor: '#fff', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32, mr: 1 }} />
            <Typography variant="h4" fontWeight={700} sx={{ textDecoration: 'underline', textUnderlineOffset: 8, fontSize: { xs: 22, md: 30 }, color: '#d32f2f', letterSpacing: -0.5 }}>
              {t('home.bloodSection.title')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4, overflowX: { xs: 'auto', md: 'visible' }, justifyContent: 'center', pb: 2 }}>
            {bloodCards.map((card, idx) => (
              <Paper
                key={idx}
                elevation={2}
                sx={{ bgcolor: '#fff', borderRadius: cardRadius, p: 3, minWidth: 260, maxWidth: 320, minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: cardShadow, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 8px 32px 0 rgba(211,47,47,0.15)' } }}
                onClick={() => setOpenCard(idx)}
              >
                {card.icon}
                <Typography fontWeight={600} sx={{ mt: 1, fontSize: 18, mb: 1, color: '#d32f2f' }}>{card.title}</Typography>
                <Typography sx={{ fontSize: 15, textAlign: 'center', color: 'text.secondary' }}>{card.content}</Typography>
              </Paper>
            ))}
          </Box>
          <Dialog open={openCard !== null} onClose={() => setOpenCard(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#d32f2f', fontWeight: 700 }}>
              {openCard !== null && bloodCards[openCard].title}
              <IconButton onClick={() => setOpenCard(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: 'text.secondary', fontSize: 17 }}>
                {openCard !== null && (typeof bloodCards[openCard].details === 'string' ? bloodCards[openCard].details : bloodCards[openCard].details)}
          </Typography>
            </DialogContent>
          </Dialog>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: sectionBg, py: 8 }}>
        <Container maxWidth="lg">
          <Typography align="center" sx={{ mb: 3, fontSize: 20, color: 'text.primary', fontWeight: 500 }}>
            {t('home.cta.text')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 8, py: 1.5, fontWeight: 700, borderRadius: 3, fontSize: 22,
                background: 'linear-gradient(90deg, #d32f2f 60%, #ff7961 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(211,47,47,0.15)',
                transition: 'transform 0.15s',
                '&:hover': { background: 'linear-gradient(90deg, #b71c1c 60%, #ff7961 100%)', transform: 'scale(1.04)' }
              }}
              onClick={() => navigate('/register')}
            >
              {t('home.cta.button')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#fff', py: 4, mt: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BloodtypeIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>{t('home.footer.title')}</Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>{t('home.footer.medicalFacility')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('home.footer.bloodCenter')}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} sx={{ mb: 1, color: '#d32f2f' }}>{t('home.footer.address')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('home.footer.addressValue')}</Typography>
              <Typography fontWeight={700} sx={{ mt: 2, mb: 1, color: '#d32f2f' }}>{t('home.footer.officeHours')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>0123456789</Typography>
              <Typography sx={{ color: 'text.secondary' }}>0123456789</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} sx={{ mb: 1, color: '#d32f2f' }}>{t('home.footer.support')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('home.footer.terms')}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: '#d32f2f' }} />
          <Typography align="center" sx={{ color: 'text.secondary' }}>
            {t('home.footer.copyright')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 