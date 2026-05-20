<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { FACULTY_LIST, DEPARTMENT_MAP } from '@/data/facultyDepartments.js'
import { CountrySelect } from 'vue3-country-region-select'
import IntlTelInput from '@intl-tel-input/vue'
import 'intl-tel-input/styles'

const props = defineProps({
  step: Number,
  selectedType: String,
  showError: Boolean,
  step1Error: Boolean,
  step2Error: Boolean,
  pdpaConsent: Boolean,
  mediaConsent: Boolean,
  regisData: Object,
})

const emit = defineEmits([
  'update:selectedType',
  'update:showError',
  'update:pdpaConsent',
  'update:mediaConsent',
  'update:regisData',
])

const { locale, t } = useLocale()
const participantType = ref('')
const organization = ref('')
const faculty = ref('')
const facultyOther = ref('')
const department = ref('')
const departmentOther = ref('')
const prename = ref('')
const fullname = ref('')
const nickname = ref('')
const dob = ref('')
const email = ref('')
const phoneNo = ref('')
const country = ref('')

// --- computed: departments ที่กรองตาม faculty ที่เลือก ---
const availableDepartments = computed(() => {
  if (!faculty.value || faculty.value === 'other') return []
  return DEPARTMENT_MAP[faculty.value] ?? [{ value: 'other', th: 'อื่น ๆ', en: 'Other' }]
})

const isFullnameValid = computed(() => {
  if (!fullname.value) return false
  // เช็คว่ามีการเว้นวรรคระหว่างชื่อและนามสกุลหรือไม่
  const parts = fullname.value.trim().split(/\s+/)
  return parts.length >= 2
})

const isDobValid = computed(() => {
  if (!dob.value) return false
  const selectedDate = new Date(dob.value)
  const today = new Date()
  // เซ็ตเวลาเป็น 00:00:00 เพื่อให้สามารถเลือกวันปัจจุบันได้
  today.setHours(0, 0, 0, 0)
  return selectedDate <= today
})

const isEmailValid = computed(() => {
  if (!email.value) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isPhoneValid = computed(() => {
  if (!phoneNo.value) return false
  const cleanPhone = phoneNo.value.replace(/[\s-]/g, '')
  const phoneRegex = /^\+?[0-9]{9,15}$/
  return phoneRegex.test(cleanPhone)
})

// --- Step 1 validity ---
const NEEDS_ORG = ['STUDENT', 'TEACHER', 'SPECIAL_GUEST', 'STAFF']

const isStep1Valid = computed(() => {
  if (!participantType.value) return false

  if (NEEDS_ORG.includes(participantType.value)) {
    if (!organization.value.trim()) return false
  }

  if (participantType.value === 'STUDENT') {
    const hasFaculty = faculty.value && (faculty.value !== 'other' || facultyOther.value.trim())
    const hasDept =
      department.value && (department.value !== 'other' || departmentOther.value.trim())
    if (!hasFaculty || !hasDept) return false
  }

  return true
})

const createRegisData = () => {
  const [firstname = '', lastname = ''] = fullname.value.trim().split(/\s+/)

  return {
    title: prename.value,
    firstName: firstname,
    lastName: lastname,
    nickname: nickname.value.trim(),
    dateOfBirth: dob.value,
    email: email.value.trim(),
    phoneNumber: phoneNo.value,
    nationality: country.value,

    participantType: participantType.value,
    organization: organization.value,
    faculty: faculty.value,
    facultyOther: facultyOther.value,
    department: department.value,
    departmentOther: departmentOther.value,

    consent: props.pdpaConsent && props.mediaConsent,
    isStep1Valid: isStep1Valid.value,
    isFormatValid:
      isEmailValid.value && isPhoneValid.value && isFullnameValid.value && isDobValid.value,
  }
}

watch(participantType, () => {
  organization.value = ''
  faculty.value = ''
  facultyOther.value = ''
  department.value = ''
  departmentOther.value = ''
})

watch(
  [
    prename,
    fullname,
    nickname,
    dob,
    email,
    phoneNo,
    country,
    participantType,
    organization,
    faculty,
    facultyOther,
    department,
    departmentOther,
  ],
  () => emit('update:regisData', createRegisData()),
  { immediate: true },
)

// reset department เมื่อ faculty เปลี่ยน
watch(faculty, (newFaculty) => {
  department.value = newFaculty === 'other' ? 'other' : ''
  departmentOther.value = ''
})

watch(
  [prename, fullname, nickname, dob, email, phoneNo, country],
  () => {
    emit('update:regisData', createRegisData())
  },
  { immediate: true },
)

const handleSelect = (value) => {
  emit('update:selectedType', value)
  emit('update:showError', false)
}

const handlePhoneCountryChange = (countryCode) => {
  if (typeof countryCode === 'string') {
    country.value = countryCode.toUpperCase()
  } else if (countryCode && countryCode.iso2) {
    country.value = countryCode.iso2.toUpperCase()
  }
}

const i18n = {
  // Step 1
  step1Title: { 'th-TH': 'ประเภทผู้เข้าร่วม', 'en-US': 'Participant Type' },
  chooseOption: { 'th-TH': 'เลือกตัวเลือก...', 'en-US': 'Choose an option...' },
  individual: { 'th-TH': 'รายบุคคล', 'en-US': 'Individual' },
  group: { 'th-TH': 'ตัวแทนองค์กร', 'en-US': 'Organization Representative' },
  errorSelect: {
    'th-TH': 'กรุณาเลือกประเภทการลงทะเบียนก่อนไปต่อ',
    'en-US': 'Please select a registration type before continuing',
  },
  participantTypeOpt1: { 'th-TH': 'นักเรียน/นักศึกษา', 'en-US': 'Student' },
  participantTypeOpt2: { 'th-TH': 'คุณครู/อาจารย์', 'en-US': 'Teacher' },
  participantTypeOpt3: { 'th-TH': 'สตาฟประจำงาน', 'en-US': 'Event Staff' },
  participantTypeOpt4: { 'th-TH': 'บุคคลทั่วไป', 'en-US': 'General Public' },
  participantTypeOpt5: { 'th-TH': 'แขกรับเชิญพิเศษ', 'en-US': 'Special Guest' },
  organization: { 'th-TH': 'หน่วยงาน/สถานศึกษา', 'en-US': 'Organization/University' },
  organizationPlc: { 'th-TH': 'หน่วยงาน/สถานศึกษา', 'en-US': 'Organization/University' },
  chooseDept: { 'th-TH': 'เลือกภาควิชา/สาขา...', 'en-US': 'Choose a department...' },
  facultyOtherPlc: { 'th-TH': 'ระบุคณะ', 'en-US': 'Specify faculty' },
  deptOtherPlc: { 'th-TH': 'ระบุภาควิชา/สาขา', 'en-US': 'Specify department' },

  // Faculty and Department
  facultyLabel: { 'th-TH': 'คณะ', 'en-US': 'Faculty' },
  chooseFaculty: { 'th-TH': 'เลือกคณะ...', 'en-US': 'Choose a faculty...' },
  facEng: { 'th-TH': 'วิศวกรรมศาสตร์', 'en-US': 'Engineering' },
  facSci: { 'th-TH': 'วิทยาศาสตร์', 'en-US': 'Science' },
  facFIET: {
    'th-TH': 'ครุศาสตร์อุตสาหกรรมและเทคโนโลยี (FIET)',
    'en-US': 'Industrial Education and Technology (FIET)',
  },
  facSIT: { 'th-TH': 'เทคโนโลยีสารสนเทศ (SIT)', 'en-US': 'Information Technology (SIT)' },
  facArch: { 'th-TH': 'สถาปัตยกรรมศาสตร์และการออกแบบ', 'en-US': 'Architecture and Design' },
  facEnergy: {
    'th-TH': 'พลังงานสิ่งแวดล้อมและวัสดุ',
    'en-US': 'Energy, Environment and Materials',
  },
  facBio: { 'th-TH': 'ทรัพยากรชีวภาพและเทคโนโลยี', 'en-US': 'Bioresources and Technology' },
  facSoLA: { 'th-TH': 'ศิลปศาสตร์ (SoLA)', 'en-US': 'Liberal Arts (SoLA)' },
  facGMI: {
    'th-TH': 'บัณฑิตวิทยาลัยการจัดการและนวัตกรรม',
    'en-US': 'Graduate School of Management and Innovation (GMI)',
  },
  facFIBO: {
    'th-TH': 'สถาบันวิทยาการหุ่นยนต์ภาคสนาม (FIBO)',
    'en-US': 'Institute of Field Robotics (FIBO)',
  },
  facJGSEE: {
    'th-TH': 'บัณฑิตวิทยาลัยร่วมด้านพลังงานและสิ่งแวดล้อม',
    'en-US': 'Joint Graduate School of Energy and Environment (JGSEE)',
  },
  facMulti: { 'th-TH': 'วิทยาลัยสหวิทยาการ', 'en-US': 'Multidisciplinary College' },
  facOther: { 'th-TH': 'อื่น ๆ', 'en-US': 'Other' },
  departmentLabel: { 'th-TH': 'ภาควิชา/สาขา', 'en-US': 'Department/Major' },

  // Step 2
  step2Title: { 'th-TH': 'ข้อมูลทั่วไป', 'en-US': 'General Information' },
  fullname: { 'th-TH': 'ชื่อ-สกุล', 'en-US': 'Full Name' },
  fullnamePlc: { 'th-TH': 'เช่น สมชาย ใจดี', 'en-US': 'e.g. John Doe' },
  selectPlc: { 'th-TH': 'เลือก', 'en-US': 'Select' },
  prenameOpt1: { 'th-TH': 'นาย', 'en-US': 'Mr.' },
  prenameOpt2: { 'th-TH': 'นาง', 'en-US': 'Mrs.' },
  prenameOpt3: { 'th-TH': 'น.ส.', 'en-US': 'Ms.' },
  prenameOpt4: { 'th-TH': 'ด.ช.', 'en-US': 'Master' },
  prenameOpt5: { 'th-TH': 'ด.ญ.', 'en-US': 'Miss' },
  nickname: { 'th-TH': 'ชื่อเล่น', 'en-US': 'Nickname' },
  nicknamePlc: { 'th-TH': 'เช่น พลอย', 'en-US': 'e.g. John' },
  dob: { 'th-TH': 'วัน/เดือน/ปีเกิด', 'en-US': 'Date of Birth' },
  email: { 'th-TH': 'อีเมล', 'en-US': 'Email' },
  emailPlc: { 'th-TH': 'เช่น john.doe@email.com', 'en-US': 'e.g. john.doe@email.com' },
  phone: { 'th-TH': 'เบอร์โทรศัพท์ที่ติดต่อได้', 'en-US': 'Phone Number' },
  nationality: { 'th-TH': 'สัญชาติ', 'en-US': 'Nationality' },
  nationalityPlc: { 'th-TH': 'ค้นหาสัญชาติ', 'en-US': 'Search for a nationality' },

  // Step 3
  step3Title: { 'th-TH': 'ข้อตกลงและเงื่อนไข', 'en-US': 'Terms and Conditions' },
  pdpaConsent: {
    'th-TH':
      'ข้าพเจ้ายินยอมให้ผู้จัดงานเก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลที่ให้ไว้ในแบบฟอร์มนี้ เพื่อวัตถุประสงค์ในการลงทะเบียน การยืนยันตัวตน การจัดกิจกรรม การติดต่อสื่อสาร และการบริหารจัดการงาน Thai Sustainable Culture Fest 2026 เท่านั้น',
    'en-US':
      'I consent to the collection, use, and processing of my personal data provided in this form for registration, identity verification, event communication, and event management purposes for Thai Sustainable Culture Fest 2026 only.',
  },
  mediaConsent: {
    'th-TH':
      'ข้าพเจ้ายินยอมให้ผู้จัดงานบันทึกภาพนิ่ง วิดีโอ หรือเสียงของข้าพเจ้าในระหว่างการเข้าร่วมกิจกรรม และนำไปใช้เพื่อการประชาสัมพันธ์ รายงานผลกิจกรรม หรือเผยแพร่ผ่านช่องทางของมหาวิทยาลัยและผู้จัดงาน โดยไม่ใช้ในเชิงพาณิชย์',
    'en-US':
      'I consent to the organizer capturing my photos, videos, or audio during the event and using them for public relations, event reporting, or publication through the university and organizer channels, without commercial use.',
  },
  pdpaLabel: {
    'th-TH': 'ข้าพเจ้ารับทราบและยินยอมให้ประมวลผลข้อมูลส่วนบุคคลตามที่ระบุข้างต้น',
    'en-US': 'I acknowledge and consent to the personal data processing stated above.',
  },
  mediaLabel: {
    'th-TH': 'ข้าพเจ้ายินยอมให้บันทึกภาพ วิดีโอ และเสียงระหว่างกิจกรรม',
    'en-US': 'I consent to photo, video, and audio recording during the event.',
  },

  // Error Messages
  errorRequired: {
    'th-TH': 'กรุณากรอกข้อมูลให้ครบถ้วน',
    'en-US': 'This field is required',
  },
  errorFullname: {
    'th-TH': 'กรุณากรอกทั้งชื่อและนามสกุล (เว้นวรรคระหว่างชื่อและนามสกุล)',
    'en-US': 'Please enter both first and last name (separated by a space)',
  },
  errorDobFuture: {
    'th-TH': 'วันเกิดต้องไม่เป็นวันในอนาคต',
    'en-US': 'Date of birth cannot be in the future',
  },
  errorEmailFormat: {
    'th-TH': 'รูปแบบอีเมลไม่ถูกต้อง',
    'en-US': 'Invalid email format',
  },
  errorPhoneFormat: {
    'th-TH': 'เบอร์โทรศัพท์ไม่ถูกต้อง',
    'en-US': 'Invalid phone number format',
  },
}
</script>

<template>
  <section id="register-main">
    <main v-show="step === 1">
      <h6>{{ t(i18n.step1Title) }}</h6>
      <form>
        <!-- Participant Type -->
        <div class="field">
          <select
            v-model="participantType"
            name="participantType"
            :class="{ 'error-border': step1Error && !participantType }"
            @change="handleSelect(participantType)"
          >
            <option value="" disabled selected hidden>{{ t(i18n.chooseOption) }}</option>
            <option value="STUDENT">{{ t(i18n.participantTypeOpt1) }}</option>
            <option value="TEACHER">{{ t(i18n.participantTypeOpt2) }}</option>
            <option value="STAFF">{{ t(i18n.participantTypeOpt3) }}</option>
            <option value="GENERAL_PUBLIC">{{ t(i18n.participantTypeOpt4) }}</option>
            <option value="SPECIAL_GUEST">{{ t(i18n.participantTypeOpt5) }}</option>
          </select>
        </div>

        <!-- Organization (STUDENT / TEACHER / STAFF / SPECIAL_GUEST) -->
        <div v-if="participantType && participantType !== 'GENERAL_PUBLIC'" class="field">
          <label>{{ t(i18n.organization) }}</label>
          <input
            v-model="organization"
            type="text"
            :placeholder="t(i18n.organizationPlc)"
            :class="{ 'error-border': step1Error && !organization.trim() }"
          />
        </div>

        <!-- Faculty (STUDENT only) -->
        <div v-if="participantType === 'STUDENT'" class="field">
          <label>{{ t(i18n.facultyLabel) }}</label>
          <select
            v-model="faculty"
            name="faculty"
            :class="{ 'error-border': step1Error && !faculty }"
          >
            <option value="" disabled selected hidden>{{ t(i18n.chooseFaculty) }}</option>
            <option v-for="fac in FACULTY_LIST" :key="fac.value" :value="fac.value">
              {{ locale === 'th-TH' ? fac.th : fac.en }}
            </option>
          </select>
          <!-- Other faculty free text -->
          <input
            v-if="faculty === 'other'"
            v-model="facultyOther"
            type="text"
            :placeholder="t(i18n.facultyOtherPlc)"
            :class="{ 'error-border': step1Error && !facultyOther.trim() }"
            style="margin-top: var(--sp-s)"
          />
        </div>

        <!-- Department (STUDENT + faculty selected) -->
        <div v-if="participantType === 'STUDENT' && faculty" class="field">
          <label>{{ t(i18n.departmentLabel) }}</label>
          <select
            v-if="participantType === 'STUDENT' && faculty && faculty !== 'other'"
            v-model="department"
            name="department"
            :class="{ 'error-border': step1Error && !department }"
          >
            <option value="" disabled selected hidden>{{ t(i18n.chooseDept) }}</option>
            <option v-for="dept in availableDepartments" :key="dept.value" :value="dept.value">
              {{ locale === 'th-TH' ? dept.th : dept.en }}
            </option>
          </select>
          <!-- Other department free text -->
          <input
            v-if="department === 'other'"
            v-model="departmentOther"
            type="text"
            :placeholder="t(i18n.deptOtherPlc)"
            :class="{ 'error-border': step1Error && !departmentOther.trim() }"
            style="margin-top: var(--sp-s)"
          />
        </div>
      </form>
      <small v-if="step1Error && !isStep1Valid" class="error-text">
        {{ t(i18n.errorSelect) }}
      </small>
    </main>

    <main v-show="step === 2">
      <h6>{{ t(i18n.step2Title) }}</h6>
      <form>
        <div class="field">
          <label for="fullname">{{ t(i18n.fullname) }}</label>
          <div class="field-input">
            <select
              v-model="prename"
              name="prename"
              id="prename"
              :class="{ 'error-border': step2Error && !prename }"
            >
              <option value="" disabled selected hidden>{{ t(i18n.selectPlc) }}</option>
              <option :value="t(i18n.prenameOpt1)">{{ t(i18n.prenameOpt1) }}</option>
              <option :value="t(i18n.prenameOpt2)">{{ t(i18n.prenameOpt2) }}</option>
              <option :value="t(i18n.prenameOpt3)">{{ t(i18n.prenameOpt3) }}</option>
              <option :value="t(i18n.prenameOpt4)">{{ t(i18n.prenameOpt4) }}</option>
              <option :value="t(i18n.prenameOpt5)">{{ t(i18n.prenameOpt5) }}</option>
            </select>
            <input
              v-model="fullname"
              type="text"
              class="step2"
              name="fullname"
              id="fullname"
              :placeholder="t(i18n.fullnamePlc)"
              :class="{ 'error-border': step2Error && !fullname }"
            />
          </div>
          <small
            class="error-text"
            v-if="step2Error && (!prename || !fullname)"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorRequired) }}
          </small>
          <small
            class="error-text"
            v-else-if="step2Error && fullname && !isFullnameValid"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorFullname) }}
          </small>
        </div>

        <div class="field">
          <label for="">{{ t(i18n.nickname) }}</label>
          <input
            v-model="nickname"
            type="text"
            :placeholder="t(i18n.nicknamePlc)"
            :class="{ 'error-border': step2Error && !nickname }"
          />
        </div>

        <div class="field">
          <label for="">{{ t(i18n.dob) }}</label>
          <input
            v-model="dob"
            type="date"
            name="dob"
            :class="{ 'error-border': step2Error && (!dob || !isDobValid) }"
          />
          <small
            class="error-text"
            v-if="step2Error && dob && !isDobValid"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorDobFuture) }}
          </small>
        </div>

        <div class="field">
          <label for="">{{ t(i18n.email) }}</label>
          <input
            v-model="email"
            type="email"
            :placeholder="t(i18n.emailPlc)"
            :class="{ 'error-border': step2Error && (!email || !isEmailValid) }"
          />
          <small
            class="error-text"
            v-if="step2Error && email && !isEmailValid"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorEmailFormat) }}
          </small>
        </div>

        <div class="field">
          <label for="">{{ t(i18n.phone) }}</label>
          <div :class="{ 'phone-error-wrapper': step2Error && (!phoneNo || !isPhoneValid) }">
            <IntlTelInput
              v-model="phoneNo"
              initialCountry="th"
              @change-country="handlePhoneCountryChange"
              :load-utils="() => import('intl-tel-input/utils')"
            />
          </div>

          <small class="error-text" v-if="step2Error && !phoneNo" style="color: var(--clr-sem-err)">
            {{ t(i18n.errorRequired) }}
          </small>
          <small
            class="error-text"
            v-else-if="step2Error && phoneNo && !isPhoneValid"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorPhoneFormat) }}
          </small>
        </div>

        <div class="field">
          <label for="">{{ t(i18n.nationality) }}</label>
          <div :class="{ 'country-error-wrapper': step2Error && !country }">
            <CountrySelect
              v-model="country"
              :country="country"
              topCountry="TH"
              :placeholder="t(i18n.nationalityPlc)"
              class="country-select"
            />
          </div>
          <small class="error-text" v-if="step2Error && !country" style="color: var(--clr-sem-err)">
            {{ t(i18n.errorRequired) }}
          </small>
        </div>
      </form>
    </main>

    <main v-show="step === 3">
      <h6>{{ t(i18n.step3Title) }}</h6>
      <form id="step3-form">
        <p>{{ t(i18n.pdpaConsent) }}</p>
        <label for="pdpaConsent"
          ><input
            type="checkbox"
            :checked="pdpaConsent"
            @change="(e) => emit('update:pdpaConsent', e.target.checked)"
            id="pdpaConsent"
          />{{ t(i18n.pdpaLabel) }}</label
        >
        <p>{{ t(i18n.mediaConsent) }}</p>
        <label for="mediaConsent"
          ><input
            type="checkbox"
            :checked="mediaConsent"
            @change="(e) => emit('update:mediaConsent', e.target.checked)"
            id="mediaConsent"
          />{{ t(i18n.mediaLabel) }}</label
        >
      </form>
    </main>
  </section>
</template>

<style scoped>
/* ######################## PHONE INPUT OVERRIDES (CHIP STYLE) ######################## */

:deep(.iti) {
  width: 100%;
  display: block !important;
  position: relative !important;
}

:deep(.iti__country-container) {
  padding: var(--sp-s);
}

:deep(.iti__flag-container),
:deep(.iti__country-container) {
  position: absolute !important;
  top: 0.5em !important;
  bottom: 0.5em !important;
  left: 0.5em !important;
  transform: none !important;
  height: auto !important;
  padding: 0 !important;
  background: transparent !important;
  z-index: 10 !important;
}

:deep(.iti__selected-flag),
:deep(.iti__selected-country) {
  height: 100% !important;
  background: var(--clr-200) !important;
  padding: 0 var(--sp-s) 0 0 !important;
  border-radius: var(--sp-xs) !important;
  outline: none !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center;
  box-sizing: border-box;
}

:deep(.iti__selected-flag:hover),
:deep(.iti__selected-flag:focus) {
  background: var(--clr-300, #cbd5e1) !important;
  cursor: pointer;
}

:deep(.iti__selected-dial-code) {
  font-family: inherit;
  font-size: var(--fs-p2);
}

:deep(.iti input[type='tel']) {
  width: 100% !important;
  padding: var(--sp-s) !important;
  padding-left: 7.5em !important;
  border-radius: var(--sp-s) !important;
  margin: 0 !important;
  box-sizing: border-box;
  z-index: 1 !important;
  font-size: 16px !important;
}

:deep(.iti__dropdown-content),
:deep(.iti__country-list) {
  top: calc(100% + 4px) !important;
  left: 0 !important;
  width: max-content;
  border-radius: 8px !important;
  z-index: 99 !important;
}

:deep(.iti.error-border) {
  box-shadow: none !important;
}
.phone-error-wrapper :deep(input[type='tel']) {
  border-color: var(--clr-sem-err) !important;
  box-shadow: 0 0 0 1px var(--clr-sem-err) !important;
}

.country-error-wrapper :deep(select) {
  border-color: var(--clr-sem-err) !important;
  box-shadow: 0 0 0 2px var(--clr-sem-err) !important;
}

:deep(select.country-select) {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
}
</style>
