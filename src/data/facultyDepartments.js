export const FACULTY_LIST = [
  { value: 'FE', th: 'วิศวกรรมศาสตร์', en: 'Engineering (FE)' },
  { value: 'FSCI', th: 'วิทยาศาสตร์', en: 'Science (FSci)' },
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
    {
      value: '',
      th: 'วิศวกรรมโยธา (หลักสูตรนานาชาติ)',
      en: 'Civil Engineering (International Program)',
    },
    { value: 'CPE', th: 'วิศวกรรมคอมพิวเตอร์', en: 'Computer Engineering' },
    {
      value: '',
      th: 'วิศวกรรมคอมพิวเตอร์ (หลักสูตรนานาชาติ)',
      en: 'Computer Engineering (International Program)',
    },
    {
      value: 'INC',
      th: 'วิศวกรรมระบบควบคุมและเครื่องมือวัด',
      en: 'Control System and Instrumentation Engineering',
    },
    { value: 'EE', th: 'วิศวกรรมไฟฟ้า', en: 'Electrical Engineering' },
    { value: 'ENV', th: 'วิศวกรรมสิ่งแวดล้อม', en: 'Environmental Engineering' },
    {
      value: '',
      th: 'วิศวกรรมสิ่งแวดล้อม (หลักสูตรนานาชาติ)',
      en: 'Environmental Engineering (International Program)',
    },
    { value: 'ME', th: 'วิศวกรรมเครื่องกล', en: 'Mechanical Engineering' },
    { value: 'PE', th: 'วิศวกรรมการผลิต', en: 'Production Engineering' },
    { value: '', th: 'วิศวกรรมวัสดุ', en: 'Materials Engineering' },
    { value: 'FoE', th: 'วิศวกรรมอาหาร', en: 'Food Engineering' },
    { value: 'BE', th: 'วิศวกรรมชีวภาพ', en: 'Biological Engineering' },
    { value: 'PE', th: 'วิศวกรรมอุตสาหการ', en: 'Production Engineering' },
    { value: '', th: 'วิศวกรรมเซมิคอนดักเตอร์', en: 'Semiconductor Engineering' },
    {
      value: '',
      th: 'วิศวกรรมไฟฟ้าสื่อสารและอิเล็กทรอนิกส์',
      en: 'Electrical Communication and Electronic Engineering',
    },
    {
      value: '',
      th: 'วิศวกรรมระบบอุตสาหกรรมและการประกอบการธุรกิจ',
      en: 'Industrial Systems Engineering and Entrepreneurship',
    },
    { value: '', th: 'วิศวกรรมเครื่องกลและพลังงาน', en: 'Mechanical and Energy Engineering' },
    { value: '', th: 'วิศวกรรมยานยนต์', en: 'Automotive Engineering' },
    {
      value: '',
      th: 'วิศวกรรมไฟฟ้า (ระบบไฟฟ้า อิเล็กทรอนิกส์ และพลังงาน)',
      en: 'Electrical Engineering (Power System, Power Electronics and Energy)',
    },
    {
      value: '',
      th: 'วิศวกรรมอิเล็กทรอนิกส์และสารสนเทศสื่อสาร (หลักสูตรนานาชาติ)',
      en: 'Electrical Communication and Electronic Engineering (International Program)',
    },
    { value: '', th: 'วิทยาศาสตร์ข้อมูลสุขภาพ', en: 'Health Data Science' },
    {
      value: '',
      th: 'วิศวกรรมการผลิตอัจฉริยะและเครื่องมือขั้นสูง',
      en: 'Smart Manufacturing and Advanced Tool Engineering',
    },
    {
      value: '',
      th: 'วิศวกรรมอัตโนมัติ (หลักสูตรนานาชาติ)',
      en: 'Automation Engineering (International Program)',
    },
    { value: '', th: 'วิศวกรรมเมคคาทรอนิกส์', en: 'Mechatronics Engineering' },
    {
      value: '',
      th: 'วิศวกรรมการผลิตชิ้นส่วนยานยนต์และอากาศยาน',
      en: 'Automotive and Aerospace Parts Manufacturing Engineering',
    },
    { value: '', th: 'วิศวกรรมไฟฟ้าและสารสนเทศ', en: 'Electrical and Information Engineering' },
    {
      value: '',
      th: 'วิศวกรรมและการบริหารการก่อสร้าง',
      en: 'Construction Engineering and Management',
    },
    {
      value: '',
      th: 'วิศวกรรมสิ่งแวดล้อมและความยั่งยืน',
      en: 'Environmental Engineering and Sustainability',
    },
    {
      value: '',
      th: 'วิศวกรรมอุตสาหการและระบบการผลิต',
      en: 'Industrial and Manufacturing Systems Engineering',
    },
    {
      value: '',
      th: 'นวัตกรรมการผลิตและวิศวกรรมวัสดุ',
      en: 'Innovative Manufacturing and Materials Engineering',
    },
    { value: '', th: 'เทคโนโลยีวิศวกรรมโยธา', en: 'Civil Engineering Technology' },
    {
      value: '',
      th: 'วิศวกรรมยานยนต์และการขนส่งขั้นสูง (หลักสูตรนานาชาติ)',
      en: 'Automotive and Advanced Transportation Engineering',
    },
    {
      value: '',
      th: 'เทคโนโลยีวิศวกรรมไฟฟ้าและสารสนเทศ',
      en: 'Electrical and Information Engineering Technology',
    },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  FSCI: [
    { value: 'MATH', th: 'คณิตศาสตร์', en: 'Mathematics' },
    { value: 'PHYS', th: 'ฟิสิกส์', en: 'Physics' },
    { value: 'CHEM', th: 'เคมี', en: 'Chemistry' },
    { value: 'BIO', th: 'ชีววิทยา', en: 'Biology' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  FIET: [
    { value: '', th: 'เทคโนโลยีบรรจุภัณฑ์และการพิมพ์', en: 'Packaging and Printing Technology' },
    { value: '', th: 'เทคโนโลยีอุตสาหกรรม', en: 'Industrial Technology' },
    {
      value: '',
      th: 'วิทยาการคอมพิวเตอร์ประยุกต์-มัลติมีเดีย',
      en: 'Applied Computer Science-Multimedia',
    },
    { value: '', th: 'วิศวกรรมเครื่องกล', en: 'Mechanical Engineering' },
    { value: '', th: 'วิศวกรรมไฟฟ้า', en: 'Electrical Engineering' },
    { value: '', th: 'วิศวกรรมโยธา', en: 'Civil Engineering ' },
    { value: '', th: 'วิศวกรรมอุตสาหการ', en: 'Electrical Engineering' },
    {
      value: '',
      th: 'เทคโนโลยีดิจิทัลทางการศึกษาและสื่อสารมวลชน',
      en: 'Educational Digital Technology and Mass Communication',
    },
    { value: '', th: 'คอมพิวเตอร์และเทคโนโลยีสารสนเทศ', en: 'Computer and Information Technology' },
    {
      value: '',
      th: 'เทคโนโลยีบรรจุภัณฑ์และนวัตกรรมการพิมพ์',
      en: 'Packaging Technology and Printing Innovation',
    },
    { value: '', th: 'นวัตกรรมการเรียนรู้และเทคโนโลยี', en: 'Learning Innovation and Technology' },
    { value: '', th: 'อื่นๆ', en: 'Other' },
  ],
  SIT: [
    { value: 'IT', th: 'เทคโนโลยีสารสนเทศ', en: 'Information Technology' },
    { value: 'CS', th: 'วิทยาการคอมพิวเตอร์', en: 'Computer Science' },
    { value: 'DSI', th: 'นวัตกรรมบริการดิจิทัล', en: 'Digital Service Innovation' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  ARCH: [
    { value: '', th: 'สถาปัตยกรรม (หลักสูตรนานาชาติ)', en: 'Architecture (International Program)' },
    {
      value: '',
      th: 'สถาปัตยกรรมภายใน (หลักสูตรนานาชาติ)',
      en: 'Interior Architecture (International Program)',
    },
    {
      value: '',
      th: 'นวัตกรรมการออกแบบ (หลักสูตรนานาชาติ)',
      en: 'Design Innovation (International Program)',
    },
    { value: '', th: 'การออกแบบอุตสาหกรรม', en: 'Industrial Design' },
    {
      value: '',
      th: 'ออกแบบนิเทศศิลป์ (หลักสูตรนานาชาติ) ',
      en: 'Communication Design (International Program)',
    },
    {
      value: '',
      th: 'การออกแบบและการวางแผน (หลักสูตรนานาชาติ)',
      en: 'Design and Planning (International Program)',
    },
    {
      value: '',
      th: 'ภูมิสถาปัตยกรรม (หลักสูตรนานาชาติ)',
      en: 'Landscape Architecture (International Program)',
    },
    {
      value: '',
      th: 'การบูรณาการการออกแบบด้วยพหุปัญญา (หลักสูตรนานาชาติ)',
      en: 'Multiple Intelligences for Design Integration (International Program)',
    },
    { value: '', th: 'เทคโนโลยีมีเดีย', en: 'Media Technology' },
    { value: '', th: 'มีเดียทางการแพทย์และวิทยาศาสตร์', en: 'Medical and Science Media' },
    { value: '', th: 'มีเดียอาตส์', en: 'Media Arts' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  ENERGY: [
    {
      value: '',
      th: 'เเทคโนโลยีพลังงานและวัสดุเพื่อความเป็นกลางทางคาร์บอน',
      en: 'Energy and Materials Technologies toward Carbon Neutrality',
    },
    { value: '', th: 'เทคโนโลยีสิ่งแวดล้อม', en: 'Environmental Technology' }, //ยุติการรับนักศึกษา
    { value: '', th: 'เทคโนโลยีวัสดุ', en: 'Materials Technology' }, //ยุติการรับนักศึกษา
    { value: '', th: 'เทคโนโลยีการจัดการพลังงาน', en: 'Energy Management Technology' },
    { value: '', th: 'เทคโนโลยีอุณหภาพ', en: 'Thermal Technology,' }, //ยุติการรับนักศึกษา
    {
      value: '',
      th: 'การออกแบบและผลิตแบบบูรณาการ',
      en: 'Design and Development of Competitive Products and Engineering Design',
    }, //ยุติการรับนักศึกษา
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  BIO: [
    {
      value: '',
      th: 'วิทยาศาสตร์ชีวภาพเชิงบูรณาการและนวัตกรรม (หลักสูตรนานาชาติ)',
      en: 'Integrative Biosciences and Innovation (International program)',
    },
    {
      value: '',
      th: 'เทคโนโลยีชีวภาพ (หลักสูตรนานาชาติ)',
      en: 'Biotechnology (International Program)',
    },
    {
      value: '',
      th: 'นิเวศวิทยาการอนุรักษ์ (หลักสูตรนานาชาติ)',
      en: 'Conservation Ecology (International Program)',
    },
    {
      value: '',
      th: 'วิทยาศาสตร์เกษตรและเทคโนโลยี (วิทยาการหลังการเก็บเกี่ยว) (หลักสูตรนานาชาติ)',
      en: 'AgriScience and Technology (Postharvest) (International Program)',
    },
    {
      value: '',
      th: 'เทคโนโลยีชีวเคมี (หลักสูตรนานาชาติ)',
      en: 'Biochemical Technology (International Program)',
    },
    {
      value: '',
      th: 'ชีวสารสนเทศและชีววิทยาระบบ (หลักสูตรนานาชาติ)',
      en: 'Bioinformatics and Systems Biology (International Program)',
    },
    {
      value: '',
      th: 'เทคโนโลยีหลังการเก็บเกี่ยว (หลักสูตรนานาชาติ)',
      en: 'Postharvest Technology (International Program)',
    },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  SOLA: [
    {
      value: 'AL',
      th: 'ภาษาอังกฤษศึกษาเชิงประยุกต์ (หลักสูตรนานาชาติ)',
      en: 'Applied English Studies (International Program)',
    },
    { value: 'BC', th: 'สังคมศาสตร์สิ่งแวดล้อม', en: 'Environmental Social Sciences' },
    {
      value: 'BC',
      th: 'ภาษาศาสตร์ประยุกต์ (หลักสูตรนานาชาติ)',
      en: 'Applied Linguistics (International Program)',
    },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  GMI: [
    {
      value: '',
      th: 'การจัดการความเป็นผู้ประกอบการ นวัตกรรมและความยั่งยืน',
      en: 'Entrepreneurship, Innovation and Sustainability Management',
    },
    { value: '', th: 'การจัดการนวัตกรรมเชิงบูรณาการ', en: 'Integrated Innovation Management' },
    {
      value: '',
      th: 'การจัดการโลจิสติกส์และซัพพลายเชน',
      en: 'Logistics and Supply Chain Management',
    },
    { value: '', th: 'การจัดการ', en: 'Management' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  FIBO: [
    {
      value: '',
      th: 'วิศวกรรมหุ่นยนต์และระบบอัตโนมัติ',
      en: 'Robotics and Automation Engineering',
    },
    { value: '', th: 'วิทยาการหุ่นยนต์และระบบอัตโนมัติ', en: 'Robotics and Automation' },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  JGSEE: [
    {
      value: '',
      th: 'ระบบพลังงานที่ยั่งยืน (หลักสูตรนานาชาติ)',
      en: 'Sustainable Energy Systems (International Program)',
    },
    {
      value: '',
      th: 'เทคโนโลยีและการจัดการสิ่งแวดล้อม (หลักสูตรนานาชาติ)',
      en: 'Environmental Technology and Management (International Program)',
    },
    {
      value: '',
      th: 'สิ่งแวดล้อม การเปลี่ยนแปลงภูมิอากาศ และความยั่งยืน (หลักสูตรนานาชาติ)',
      en: 'Environment, Climate Change and Sustainability (International Program)',
    },
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],
  MULTI: [
    {
      value: '',
      th: 'วิศวกรรมระบบปัญญาประดิษฐ์',
      en: 'Artificial Intelligence Systems Engineering',
    },
    {
      value: '',
      th: 'การออกแบบดิจิทัล (หลักสูตรนานาชาติ)',
      en: 'Digital Design (International Program)',
    },
    {
      value: '',
      th: 'เทคโนโลยีแนวสร้างสรรค์ (หลักสูตรนานาชาติ)',
      en: 'Creative Technology (International Program)',
    },
    { value: '', th: 'วิทยาศาสตร์และเทคโนโลยี', en: '' }, //ยุติการรับนักศึกษา
    { value: 'other', th: 'อื่น ๆ', en: 'Other' },
  ],

  // คณะที่ไม่มีในนี้จะ fallback เป็น Other อัตโนมัติ (for now)
}
