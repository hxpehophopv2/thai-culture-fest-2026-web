// key คงที่ ไม่ขึ้นกับภาษา
export const FACULTY_LIST = [
  { value: 'ENG', th: 'วิศวกรรมศาสตร์', en: 'Engineering' },
  { value: 'SCI', th: 'วิทยาศาสตร์', en: 'Science' },
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
  ENG: [
    { value: 'CE', th: 'วิศวกรรมโยธา', en: 'Civil Engineering' },
    { value: 'ME', th: 'วิศวกรรมเครื่องกล', en: 'Mechanical Engineering' },
    { value: 'EE', th: 'วิศวกรรมไฟฟ้า', en: 'Electrical Engineering' },
    { value: 'CHE', th: 'วิศวกรรมเคมี', en: 'Chemical Engineering' },
    { value: 'IE', th: 'วิศวกรรมอุตสาหการ', en: 'Industrial Engineering' },
    { value: 'CPE', th: 'วิศวกรรมคอมพิวเตอร์', en: 'Computer Engineering' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  SCI: [
    { value: 'MATH', th: 'คณิตศาสตร์', en: 'Mathematics' },
    { value: 'PHYS', th: 'ฟิสิกส์', en: 'Physics' },
    { value: 'CHEM', th: 'เคมี', en: 'Chemistry' },
    { value: 'BIO', th: 'ชีววิทยา', en: 'Biology' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  SIT: [
    { value: 'IT', th: 'เทคโนโลยีสารสนเทศ', en: 'Information Technology' },
    { value: 'DST', th: 'วิทยาการข้อมูล', en: 'Data Science and Technology' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  // คณะที่ไม่มีในนี้จะ fallback เป็น Other อัตโนมัติ
}
