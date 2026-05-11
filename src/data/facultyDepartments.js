export const FACULTY_LIST = [
  { value: 'FE', th: 'วิศวกรรมศาสตร์', en: 'Engineering (FE)' },
  { value: 'FSci', th: 'วิทยาศาสตร์', en: 'Science (FSci)' },
  {
    value: 'FIET',
    th: 'ครุศาสตร์อุตสาหกรรมและเทคโนโลยี (FIET)',
    en: 'Industrial Education and Technology (FIET)',
  },
  { value: 'SIT', th: 'เทคโนโลยีสารสนเทศ (SIT)', en: 'Information Technology (SIT)' },
  { value: 'ARCH', th: 'สถาปัตยกรรมศาสตร์และการออกแบบ', en: 'Architecture and Design' },
  { value: 'ENERGY', th: 'พลังงานสิ่งแวดล้อมและวัสดุ', en: 'Energy, Environment and Materials' },
  { value: 'BIO', th: 'ทรัพยากรชีวภาพและเทคโนโลยี', en: 'Bioresources and Technology' },
  { value: 'SOLA', th: 'ศิลปศาสตร์ (SoLA)', en: 'Liberal Arts (SoLA)' },
  {
    value: 'GMI',
    th: 'บัณฑิตวิทยาลัยการจัดการและนวัตกรรม (GMI)',
    en: 'Graduate School of Management and Innovation (GMI)',
  },
  {
    value: 'FIBO',
    th: 'สถาบันวิทยาการหุ่นยนต์ภาคสนาม (FIBO)',
    en: 'Institute of Field Robotics (FIBO)',
  },
  {
    value: 'JGSEE',
    th: 'บัณฑิตวิทยาลัยร่วมด้านพลังงานและสิ่งแวดล้อม',
    en: 'Joint Graduate School of Energy and Environment (JGSEE)',
  },
  { value: 'MULTI', th: 'วิทยาลัยสหวิทยาการ', en: 'Multidisciplinary College' },
  { value: 'other', th: 'อื่น ๆ', en: 'Other' },
]

export const DEPARTMENT_MAP = {
  FE: [
    { value: 'CHE', th: 'วิศวกรรมเคมี', en: 'Chemical Engineering' },
    { value: 'CE', th: 'วิศวกรรมโยธา', en: 'Civil Engineering' },
    { value: 'CPE', th: 'วิศวกรรมคอมพิวเตอร์', en: 'Computer Engineering' },
    {
      value: 'INC',
      th: 'วิศวกรรมระบบควบคุมและเครื่องมือวัด',
      en: 'Control System and Instrumentation Engineering',
    },
    { value: 'EE', th: 'วิศวกรรมไฟฟ้า', en: 'Electrical Engineering' },
    {
      value: 'ENE',
      th: 'วิศวกรรมอิเล็กทรอนิกส์และโทรคมนาคม',
      en: 'Electronics and Telecommunication Engineering',
    },
    { value: 'ENV', th: 'วิศวกรรมสิ่งแวดล้อม', en: 'Environmental Engineering' },
    { value: 'ME', th: 'วิศวกรรมเครื่องกล', en: 'Mechanical Engineering' },
    { value: 'PE', th: 'วิศวกรรมการผลิต', en: 'Production Engineering' },
    { value: 'TME', th: 'วิศวกรรมเครื่องมือและวัสดุ', en: 'Tool and Materials Engineering' },
    { value: 'FoE', th: 'วิศวกรรมอาหาร', en: 'Food Engineering' },
    { value: 'BE', th: 'วิศวกรรมชีวภาพ', en: 'Biological Engineering' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  FSci: [
    { value: 'MATH', th: 'คณิตศาสตร์', en: 'Mathematics' },
    { value: 'PHYS', th: 'ฟิสิกส์', en: 'Physics' },
    { value: 'CHEM', th: 'เคมี', en: 'Chemistry' },
    { value: 'BIO', th: 'ชีววิทยา', en: 'Biology' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  SIT: [
    { value: 'IT', th: 'เทคโนโลยีสารสนเทศ (IT)', en: 'Information Technology (IT)' },
    { value: 'CS', th: 'วิทยาการคอมพิวเตอร์ (CS)', en: 'Computer Science (CS)' },
    { value: 'DSI', th: 'นวัตกรรมบริการดิจิทัล (DSI)', en: 'Digital Service Innovation (DSI)' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  // คณะที่ไม่มีในนี้จะ fallback เป็น Other อัตโนมัติ
}
