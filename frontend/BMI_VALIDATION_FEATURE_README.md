# BMI Validation for Blood Donation - Tính Năng Sàng Lọc BMI

## Tổng Quan
Tài liệu này mô tả việc thêm tính năng sàng lọc BMI (Body Mass Index) vào quy trình hiến máu để đảm bảo an toàn cho người hiến máu theo tiêu chuẩn y tế quốc tế.

## Lý Do Thêm BMI Validation

### 1. **Tiêu Chuẩn Y Tế Quốc Tế**
- **WHO Guidelines**: BMI là chỉ số quan trọng đánh giá tình trạng dinh dưỡng
- **Blood Bank Standards**: Các ngân hàng máu quốc tế đều có quy định về BMI
- **Safety Protocols**: Giảm thiểu rủi ro biến chứng trong quá trình hiến máu

### 2. **Rủi Ro Y Tế**
- **BMI < 17**: Thiếu cân nặng, tăng nguy cơ hạ huyết áp, choáng
- **BMI > 40**: Béo phì bệnh lý, khó khăn trong thủ thuật, tăng nguy cơ biến chứng
- **BMI 35-40**: Cần đánh giá y tế đặc biệt

## Cách Thức Hoạt Động

### 1. **Tính Toán BMI**
```javascript
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};
```

### 2. **Phân Loại BMI**
```javascript
const getBMICategory = (bmi) => {
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return { category: 'Underweight', color: '#ff9800', risk: 'high' };
  if (bmiNum < 25) return { category: 'Normal', color: '#4caf50', risk: 'low' };
  if (bmiNum < 30) return { category: 'Overweight', color: '#ff9800', risk: 'medium' };
  if (bmiNum < 35) return { category: 'Obesity Class I', color: '#f44336', risk: 'high' };
  if (bmiNum < 40) return { category: 'Obesity Class II', color: '#d32f2f', risk: 'very_high' };
  return { category: 'Obesity Class III', color: '#b71c1c', risk: 'extreme' };
};
```

### 3. **Validation Rules**
```javascript
const validateBMI = (weight, height) => {
  const bmi = calculateBMI(weight, height);
  const bmiNum = parseFloat(bmi);
  
  // Loại trừ hoàn toàn
  if (bmiNum < 17) return { valid: false, severity: 'error' };
  if (bmiNum > 40) return { valid: false, severity: 'error' };
  
  // Cảnh báo cần đánh giá
  if (bmiNum < 18.5) return { valid: true, severity: 'warning' };
  if (bmiNum > 35) return { valid: true, severity: 'warning' };
  
  // Thông báo nếu cần
  if (bmiNum > 30) return { valid: true, severity: 'info' };
  
  return { valid: true, severity: 'success' };
};
```

## Giao Diện Người Dùng

### 1. **BMI Display Component**
- **Real-time calculation**: Tính toán ngay khi nhập cân nặng và chiều cao
- **Color-coded indicators**: Mã màu theo mức độ rủi ro
- **Category display**: Hiển thị phân loại BMI rõ ràng
- **Reference information**: Thông tin tham khảo về các mức BMI

### 2. **Validation Messages**
```jsx
// Error messages (prevents donation)
'BMI quá thấp có thể tăng nguy cơ phản ứng bất lợi'
'BMI quá cao có thể tăng nguy cơ biến chứng'

// Warning messages (requires evaluation)
'BMI thấp - cần theo dõi đặc biệt trong quá trình hiến máu'
'BMI cao - cần đánh giá sức khỏe toàn diện trước khi hiến máu'

// Info messages (general advice)
'BMI hơi cao - vui lòng thông báo với nhân viên y tế'
```

### 3. **Visual Indicators**
- **Green**: BMI bình thường (18.5-24.9)
- **Orange**: BMI cần chú ý (thấp cân hoặc thừa cân)
- **Red**: BMI nguy hiểm (cần loại trừ hoặc đánh giá đặc biệt)

## Backend Implementation

### 1. **Database Changes**
```sql
-- Thêm cột BMI vào bảng donation_registrations
ALTER TABLE donation_registrations 
ADD COLUMN bmi DECIMAL(4,1) COMMENT 'Calculated BMI for tracking';
```

### 2. **Entity Updates**
```java
@Entity
public class DonationRegistration {
    // ... existing fields
    private Double bmi; // Calculated BMI for tracking
}
```

### 3. **Service Validation**
```java
private void checkBasicRequirements(DonationRegistration registration, List<String> errors) {
    // BMI validation
    if (registration.getWeight() != null && registration.getHeight() != null) {
        double bmi = calculateBMI(registration.getWeight(), registration.getHeight());
        
        if (bmi < 17.0) {
            errors.add("BMI too low (" + String.format("%.1f", bmi) + 
                      ") - may increase risk of adverse reactions");
        } else if (bmi > 40.0) {
            errors.add("BMI too high (" + String.format("%.1f", bmi) + 
                      ") - may increase procedural risks");
        }
    }
}
```

## Tính Năng Mới Được Thêm

### 1. **Real-time BMI Calculator**
- Tự động tính toán khi người dùng nhập cân nặng và chiều cao
- Hiển thị ngay lập tức kết quả BMI và phân loại
- Cảnh báo real-time nếu BMI nằm ngoài giới hạn cho phép

### 2. **BMI Information Section**
- Trang thông tin chi tiết về BMI và hiến máu
- Giải thích ý nghĩa của từng mức BMI
- Hướng dẫn chuẩn bị trước khi hiến máu

### 3. **Enhanced Validation**
- Validation frontend ngay khi nhập liệu
- Validation backend toàn diện khi submit
- Lưu trữ BMI để theo dõi lịch sử

### 4. **Visual Feedback**
- Màu sắc thể hiện mức độ rủi ro
- Chip hiển thị phân loại BMI
- Alert messages phù hợp với từng trường hợp

## Tiêu Chuẩn BMI Áp Dụng

### 1. **Acceptable Range: 17-40 kg/m²**
- **Minimum BMI 17**: Dưới mức này có nguy cơ sốc hạ huyết áp
- **Maximum BMI 40**: Trên mức này khó khăn thủ thuật và tăng biến chứng

### 2. **Warning Levels**
- **BMI < 18.5**: Thiếu cân - cần theo dõi đặc biệt
- **BMI 30-35**: Béo phì độ I - thông báo với nhân viên y tế
- **BMI 35-40**: Béo phì độ II - cần đánh giá y tế trước hiến máu

### 3. **Optimal Range: 18.5-29.9**
- BMI trong khoảng này được coi là an toàn cho hiến máu
- Không cần thêm biện pháp đặc biệt

## Lợi Ích Của Tính Năng

### 1. **An Toàn Hơn**
- Giảm thiểu rủi ro biến chứng trong quá trình hiến máu
- Phát hiện sớm những người cần đánh giá y tế đặc biệt
- Tuân thủ tiêu chuẩn an toàn quốc tế

### 2. **Chuyên Nghiệp Hơn**
- Quy trình sàng lọc theo tiêu chuẩn y tế hiện đại
- Thông tin minh bạch cho người hiến máu
- Đánh giá toàn diện tình trạng sức khỏe

### 3. **Trải Nghiệm Tốt Hơn**
- Thông tin BMI real-time giúp người dùng hiểu tình trạng của mình
- Hướng dẫn rõ ràng về điều kiện hiến máu
- Cảnh báo sớm nếu không đủ điều kiện

## Kế Hoạch Mở Rộng

### 1. **BMI Tracking Over Time**
- Theo dõi thay đổi BMI qua các lần hiến máu
- Cảnh báo nếu có thay đổi đáng kể
- Tư vấn dinh dưỡng và sức khỏe

### 2. **Integration with Health Apps**
- Kết nối với ứng dụng theo dõi sức khỏe
- Sync dữ liệu từ smart scales
- Nhắc nhở duy trì BMI khỏe mạnh

### 3. **Personalized Recommendations**
- Đề xuất lịch hiến máu dựa trên BMI
- Tư vấn dinh dưỡng trước hiến máu
- Hướng dẫn phục hồi sau hiến máu

## Kết Luận

Tính năng BMI validation đã được thêm vào thành công với:

✅ **Tính toán BMI real-time** khi nhập cân nặng và chiều cao
✅ **Phân loại BMI** với màu sắc và cảnh báo phù hợp  
✅ **Validation rules** theo tiêu chuẩn y tế quốc tế
✅ **Enhanced UI/UX** với thông tin BMI chi tiết
✅ **Backend validation** và lưu trữ BMI
✅ **Information page** hướng dẫn về BMI và hiến máu

Tính năng này làm cho quy trình hiến máu **an toàn hơn**, **chuyên nghiệp hơn** và **tuân thủ tiêu chuẩn y tế** quốc tế về sàng lọc người hiến máu dựa trên chỉ số BMI.