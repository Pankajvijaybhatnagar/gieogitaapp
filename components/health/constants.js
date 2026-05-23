// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
export const C = {
  deepBrown:    '#2C1A0A',
  warmBrown:    '#4A2C0D',
  richBrown:    '#3D2010',
  gold:         '#C9A227',
  goldLight:    '#E8C55A',
  goldDark:     '#8B6914',
  goldBorder:   'rgba(201,162,39,0.30)',
  cream:        '#FDF6E3',
  creamDark:    '#F5E6C8',
  saffron:      '#E8721C',
  saffronLight: '#F4A44A',
  white:        '#FFFFFF',
  medantaBlue:  '#003F7D',
  medantaLight: '#0062B8',
  medantaPale:  'rgba(0,63,125,0.08)',
  medantaBorder:'rgba(0,63,125,0.25)',
  green:        '#1A8F4A',
  greenLight:   '#27AE60',
  greenPale:    'rgba(26,143,74,0.1)',
  error:        '#E74C3C',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const SPECIALTIES = [
  { id: '1',  icon: '🫀', name: 'Cardiology',      desc: 'Heart health & ECG screening'         },
  { id: '2',  icon: '🦴', name: 'Orthopaedics',    desc: 'Bone, joint & spine check-up'         },
  { id: '3',  icon: '🧠', name: 'Neurology',        desc: 'Brain & nervous system care'          },
  { id: '4',  icon: '👁️', name: 'Ophthalmology',   desc: 'Eye check-up & vision care'           },
  { id: '5',  icon: '🦷', name: 'Dental',           desc: 'Dental screening & care'              },
  { id: '6',  icon: '🫁', name: 'Pulmonology',      desc: 'Lung & respiratory health'            },
  { id: '7',  icon: '🩸', name: 'Diabetology',      desc: 'Diabetes screening & management'      },
  { id: '8',  icon: '🧪', name: 'Pathology',        desc: 'Blood tests & lab investigations'     },
  { id: '9',  icon: '🩺', name: 'General Medicine', desc: 'Comprehensive health check-up'        },
  { id: '10', icon: '👶', name: 'Paediatrics',      desc: 'Child health & wellness'              },
  { id: '11', icon: '👩', name: 'Gynaecology',      desc: "Women's health & wellness"            },
  { id: '12', icon: '🧴', name: 'Dermatology',      desc: 'Skin & hair health screening'         },
];

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM',
];

export const FREE_SERVICES = [
  { icon: '🩺', title: 'General Health Check-up',  desc: 'Complete physical examination by Medanta doctors'        },
  { icon: '🫀', title: 'ECG Screening',             desc: 'Electrocardiogram for heart health assessment'           },
  { icon: '🩸', title: 'Blood Sugar Test',          desc: 'Fasting & post-prandial blood glucose measurement'       },
  { icon: '💊', title: 'Blood Pressure Check',      desc: 'Hypertension screening & lifestyle counselling'          },
  { icon: '👁️', title: 'Eye Screening',            desc: 'Basic vision check & eye pressure measurement'           },
  { icon: '🦷', title: 'Dental Check-up',           desc: 'Oral health examination & hygiene advice'                },
  { icon: '🧪', title: 'BMI & Nutrition',           desc: 'Body mass index & personalized diet counselling'         },
  { icon: '🫁', title: 'Respiratory Check',         desc: 'Lung function screening & breathing assessment'          },
];

export const DOCTORS = [
  { id: '1', name: 'Dr. Priya Sharma',  spec: 'General Physician',   exp: '14 yrs', icon: '👩‍⚕️', avail: 'Mon – Sat'       },
  { id: '2', name: 'Dr. Rajesh Gupta',  spec: 'Cardiologist',        exp: '18 yrs', icon: '👨‍⚕️', avail: 'Tue, Thu, Sat'   },
  { id: '3', name: 'Dr. Sunita Mehta',  spec: 'Gynaecologist',       exp: '12 yrs', icon: '👩‍⚕️', avail: 'Mon, Wed, Fri'   },
  { id: '4', name: 'Dr. Anil Verma',    spec: 'Orthopaedic Surgeon', exp: '20 yrs', icon: '👨‍⚕️', avail: 'Mon – Fri'       },
];

export const HOW_STEPS = [
  { num: '01', icon: '📱', title: 'Select Specialty',    desc: 'Choose from 12+ medical specialties available'   },
  { num: '02', icon: '📅', title: 'Pick Date & Time',    desc: 'Choose from available slots at the camp'          },
  { num: '03', icon: '📝', title: 'Enter Details',       desc: 'Provide your name, phone and basic health info'   },
  { num: '04', icon: '✅', title: 'Get Confirmation',    desc: 'Receive booking confirmation on your phone'       },
  { num: '05', icon: '🏥', title: 'Visit & Get Treated', desc: 'Visit Gita Gyan Sansthanam on the booked day'     },
];

// ─── DATE HELPER ──────────────────────────────────────────────────────────────
export const getDates = () => {
  const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dates  = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      date:  `${d.getDate()} ${months[d.getMonth()]}`,
      full:  d.toDateString(),
    });
  }
  return dates;
};