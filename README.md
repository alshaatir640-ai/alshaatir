# م/ محمد خالد - معلم رياضيات

موقع تسجيل طلاب لمعلم الرياضيات م/ محمد خالد.

## المميزات

- تصميم عصري متجاوب (Mobile / Tablet / Desktop)
- دعم كامل للغة العربية (RTL)
- تأثيرات Glassmorphism
- رسوم متحركة سلسة (Scroll Reveal)
- نموذج حجز مع تحقق من البيانات
- تكامل مع Google Sheets عبر Apps Script
- تكامل مع WhatsApp
- زر WhatsApp عائم

## الملفات

```
├── index.html        # الصفحة الرئيسية
├── style.css         # الأنماط
├── script.js         # المنطق البرمجي
├── images/
│   └── teacher.jpg   # صورة المعلم
└── README.md
```

## الإعداد

### 1. صورة المعلم

ضع صورة المعلم في: `images/teacher.jpg`

### 2. Google Sheets Integration

1. أنشئ Google Sheet جديد
2. اذهب إلى Extensions > Apps Script
3. الصق الكود التالي:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name,
    data.phone,
    data.grade,
    data.school,
    data.notes
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. انشر كـ Web App (Deploy > New deployment > Web app)
5. اضبط الوصول إلى "Anyone"
6. انسخ الرابط وضعه في `script.js`:

```javascript
const SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL";
```

## النشر

### GitHub Pages
1. ارفع الملفات على GitHub
2. اذهب إلى Settings > Pages
3. اختر الفرع والمجلد

### Netlify
1. اسحب المجلد وأفلته على Netlify
2. أو اربطه بمستودع GitHub

### Cloudflare Pages
1. اربط المستودع بـ Cloudflare Pages
2. اضبط Build output إلى الجذر

## التقنيات

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript ES6+
- Cairo Font (Google Fonts)
- Font Awesome 6
