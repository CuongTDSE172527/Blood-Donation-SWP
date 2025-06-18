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

const learnCards = [
  { icon: <FavoriteIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Người cho phổ thông' },
  { icon: <BloodtypeIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Người cho phổ thông' },
  { icon: <EmojiEmotionsIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Người cho phổ thông' },
  { icon: <GroupIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Người cho phổ thông' },
];

const bloodCards = [
  {
    icon: <InfoIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Thông tin về máu',
    content: 'Có bốn nhóm máu chính được xác định bởi sự có mặt hoặc vắng mặt của hai kháng nguyên A và B trên bề mặt hồng cầu...',
    details: (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Tổng quan nhóm máu */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
            <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>Các nhóm máu chính</Typography>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              - Có 4 nhóm máu chính: <b>A</b>, <b>B</b>, <b>AB</b> và <b>O</b>.<br/>
              - Nhóm máu được xác định bởi sự có mặt hoặc vắng mặt của kháng nguyên A và B trên bề mặt hồng cầu.<br/>
              - Ngoài ra còn có yếu tố Rh (dương tính "+" hoặc âm tính "–"), tạo thành 8 nhóm máu phổ biến (A+, A-, B+, B-, AB+, AB-, O+, O-).
            </Typography>
          </Box>
          {/* Đặc điểm từng nhóm máu */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
            <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>Đặc điểm từng nhóm máu</Typography>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              <b>Nhóm máu O:</b> Không có kháng nguyên A/B, là "người cho phổ thông" (O- cho được tất cả các nhóm máu).<br/>
              <b>Nhóm máu A:</b> Có kháng nguyên A, nhận từ A, O.<br/>
              <b>Nhóm máu B:</b> Có kháng nguyên B, nhận từ B, O.<br/>
              <b>Nhóm máu AB:</b> Có cả kháng nguyên A và B, là "người nhận phổ thông" (nhận được từ tất cả các nhóm máu).
            </Typography>
          </Box>
          {/* Tỷ lệ phân bố */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
            <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>Tỷ lệ phân bố nhóm máu</Typography>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              - O: ~42%<br/>
              - A: ~32%<br/>
              - B: ~18%<br/>
              - AB: ~8%<br/>
              (Tỷ lệ này có thể thay đổi theo từng quốc gia, khu vực)
            </Typography>
          </Box>
          {/* Ý nghĩa lâm sàng */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 320, maxWidth: 400, mb: 2 }}>
            <Typography fontWeight={700} sx={{ color: '#d32f2f', mb: 1 }}>Ý nghĩa lâm sàng</Typography>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              - Biết nhóm máu giúp truyền máu an toàn, tránh phản ứng nguy hiểm.<br/>
              - Truyền sai nhóm máu có thể gây nguy hiểm tính mạng.<br/>
              - Một số nhóm máu hiếm (như O-) rất quan trọng trong cấp cứu.
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  },
  {
    icon: <EventIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Giai đoạn xét nghiệm',
    content: 'Các xét nghiệm sẽ được tiến hành để xác định nhóm máu và kiểm tra các bệnh truyền nhiễm...',
    details: (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Các bước xét nghiệm máu:</Typography>
            </Box>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              1. Xác định nhóm máu (ABO, Rh).<br/>
              2. Sàng lọc các bệnh truyền nhiễm (HIV, viêm gan B/C, giang mai...).<br/>
              3. Kiểm tra các chỉ số an toàn khác.<br/>
              4. Đảm bảo máu hiến đạt tiêu chuẩn trước khi sử dụng.
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Lưu ý:</Typography>
            </Box>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              - Quy trình xét nghiệm được thực hiện bởi nhân viên y tế chuyên nghiệp.<br/>
              - Kết quả xét nghiệm sẽ được thông báo sau khi hoàn tất.
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  },
  {
    icon: <EmojiEmotionsIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Lời khuyên',
    content: 'Sau khi hiến máu, bạn nên nghỉ ngơi, uống nước và ăn nhẹ...',
    details: (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Lưu ý */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Lưu ý :</Typography>
            </Box>
            <Typography component="ul" sx={{ pl: 2, fontSize: 15, color: 'text.secondary' }}>
              <li>Uống sữa, rượu bia trước khi hiến máu.</li>
              <li>Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao gắng sức trong ngày lấy máu.</li>
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
              Bác sĩ Ngô Văn Tân<br />Trưởng khoa Khoa Tiếp nhận hiến máu, Bệnh viện Truyền máu Huyết học
            </Typography>
          </Box>
          {/* Nên */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#388e3c' }}>Nên:</Typography>
            </Box>
            <Typography component="ul" sx={{ pl: 2, fontSize: 15, color: 'text.secondary' }}>
              <li>Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.</li>
              <li>Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ băng keo cá nhân trong 4-6 giờ.</li>
              <li>Nằm và ngồi nghỉ tại chỗ 10 phút sau khi hiến máu.</li>
              <li>Nằm nghi đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn.</li>
              <li>Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm vết chích nếu bị sưng, bầm tím.</li>
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
              Bác sĩ Ngô Văn Tân<br />Trưởng khoa Khoa Tiếp nhận hiến máu, Bệnh viện Truyền máu Huyết học
            </Typography>
          </Box>
          {/* Không nên */}
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CancelIcon sx={{ color: '#d32f2f', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Không nên:</Typography>
            </Box>
            <Typography component="ul" sx={{ pl: 2, fontSize: 15, color: 'text.secondary' }}>
              <li>Nếu phát hiện chảy máu tại chỗ chích: Giơ tay cao.</li>
              <li>Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính.</li>
              <li>Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết.</li>
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
              Bác sĩ Ngô Văn Tân<br />Trưởng khoa Khoa Tiếp nhận hiến máu, Bệnh viện Truyền máu Huyết học
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  },
  {
    icon: <ContactSupportIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, title: 'Quy trình hiến máu',
    content: 'Toàn bộ quá trình hiến máu thường mất từ 45-60 phút, trong đó việc lấy máu chỉ mất khoảng 8-10 phút.',
    details: (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Các bước trong quy trình hiến máu:</Typography>
            </Box>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              1. Đăng ký và điền thông tin cá nhân.<br/>
              2. Khám sức khỏe và kiểm tra huyết áp, mạch, cân nặng.<br/>
              3. Lấy máu xét nghiệm.<br/>
              4. Hiến máu (8-10 phút).<br/>
              5. Nghỉ ngơi, nhận quà và giấy chứng nhận.
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#ffe6e6', borderRadius: 2, p: 2, minWidth: 250, maxWidth: 320, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: '#29b6f6', mr: 1 }} />
              <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Lưu ý:</Typography>
            </Box>
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              - Toàn bộ quy trình được thực hiện bởi nhân viên y tế chuyên nghiệp, đảm bảo an toàn tuyệt đối cho người hiến máu.<br/>
              - Nếu có bất kỳ dấu hiệu bất thường nào, hãy thông báo ngay cho nhân viên y tế.
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

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isVi = i18n.language === 'vi';
  const [openCard, setOpenCard] = useState(null);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 0 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ bgcolor: '#fff', borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: cardShadow }}>
                <Typography variant="h2" fontWeight={700} sx={{ mb: 2, textAlign: 'center', fontSize: { xs: 28, md: 40 }, color: '#d32f2f', letterSpacing: -1 }}>
                  Hệ Thống Hỗ Trợ Hiến Máu
              </Typography>
                <Typography variant="body1" sx={{ mb: 5, textAlign: 'center', fontSize: { xs: 16, md: 20 }, color: 'text.secondary' }}>
                  Tham gia mạng lưới hiến máu của chúng tôi và tạo sự khác biệt trong cuộc sống của ai đó ngay hôm nay
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
                    Đăng ký hiến máu ngay
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
              Tìm hiểu về hiến máu
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
              Nhóm Máu và Tính Tương Thích
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
            Tham gia cộng đồng người hiến máu của chúng tôi và giúp cứu sống người khác trong khu vực của bạn.
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
              Đăng ký hiến máu ngay
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
                <Typography fontWeight={700} sx={{ color: '#d32f2f' }}>Blood Donation Supported System</Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>Cơ sở y tế điều trị</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Trung tâm hiến máu</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} sx={{ mb: 1, color: '#d32f2f' }}>Địa chỉ</Typography>
              <Typography sx={{ color: 'text.secondary' }}>abcxyz</Typography>
              <Typography fontWeight={700} sx={{ mt: 2, mb: 1, color: '#d32f2f' }}>Liên hệ giờ hành chính</Typography>
              <Typography sx={{ color: 'text.secondary' }}>0123456789</Typography>
              <Typography sx={{ color: 'text.secondary' }}>0123456789</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} sx={{ mb: 1, color: '#d32f2f' }}>Hỗ trợ</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Điều khoản sử dụng</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: '#d32f2f' }} />
          <Typography align="center" sx={{ color: 'text.secondary' }}>
            © 2025 Blood Donation System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 