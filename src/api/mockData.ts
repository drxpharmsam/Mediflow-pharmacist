import type { Order, Medicine } from '../types'

/** Returns true when the logged-in user has a test / demo token */
export function isTestMode(): boolean {
  const raw = localStorage.getItem('mediflow_user')
  if (!raw) return false
  try {
    const user = JSON.parse(raw) as { token?: string }
    return typeof user.token === 'string' && user.token.startsWith('test_token_')
  } catch {
    return false
  }
}

export const MOCK_ORDERS: Order[] = [
  {
    _id: 'ord_001',
    patientName: 'Alice Johnson',
    patientPhone: '+2348012345678',
    status: 'pending',
    hasPrescription: true,
    rxImageUrl: '',
    medicines: [
      { name: 'Amoxicillin 500mg', quantity: 20, price: 150 },
      { name: 'Paracetamol 500mg', quantity: 10, price: 50 },
    ],
    totalAmount: 3500,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord_002',
    patientName: 'Bob Smith',
    patientPhone: '+2348023456789',
    status: 'processing',
    hasPrescription: false,
    medicines: [
      { name: 'Lisinopril 10mg', quantity: 30, price: 200 },
    ],
    totalAmount: 6000,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord_003',
    patientName: 'Carol White',
    patientPhone: '+2348034567890',
    status: 'ready',
    hasPrescription: true,
    medicines: [
      { name: 'Metformin 850mg', quantity: 60, price: 120 },
      { name: 'Atorvastatin 20mg', quantity: 30, price: 180 },
    ],
    totalAmount: 12600,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord_004',
    patientName: 'David Brown',
    patientPhone: '+2348045678901',
    status: 'delivered',
    hasPrescription: false,
    medicines: [
      { name: 'Ibuprofen 400mg', quantity: 15, price: 80 },
    ],
    totalAmount: 1200,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord_005',
    patientName: 'Eve Davis',
    patientPhone: '+2348056789012',
    status: 'pending',
    hasPrescription: true,
    medicines: [
      { name: 'Augmentin 625mg', quantity: 14, price: 350 },
      { name: 'Vitamin C 500mg', quantity: 30, price: 60 },
    ],
    totalAmount: 6700,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_MEDICINES: Medicine[] = [
  {
    _id: 'med_001',
    name: 'Amoxicillin 500mg',
    category: 'Infection',
    type: 'Capsule',
    price: 150,
    stock: 200,
    description: 'Broad-spectrum antibiotic for bacterial infections.',
    salt: 'Amoxicillin',
    saltStrength: '500mg',
  },
  {
    _id: 'med_002',
    name: 'Paracetamol 500mg',
    category: 'Fever',
    type: 'Tablet',
    price: 50,
    stock: 500,
    description: 'Analgesic and antipyretic for pain and fever relief.',
    salt: 'Paracetamol',
    saltStrength: '500mg',
  },
  {
    _id: 'med_003',
    name: 'Ibuprofen 400mg',
    category: 'Pain',
    type: 'Tablet',
    price: 80,
    stock: 350,
    description: 'Non-steroidal anti-inflammatory drug for pain, fever and inflammation.',
    salt: 'Ibuprofen',
    saltStrength: '400mg',
  },
  {
    _id: 'med_004',
    name: 'Lisinopril 10mg',
    category: 'Hypertension',
    type: 'Tablet',
    price: 200,
    stock: 120,
    description: 'ACE inhibitor used to treat high blood pressure and heart failure.',
    salt: 'Lisinopril',
    saltStrength: '10mg',
  },
  {
    _id: 'med_005',
    name: 'Metformin 850mg',
    category: 'Diabetes',
    type: 'Tablet',
    price: 120,
    stock: 180,
    description: 'First-line medication for treatment of type 2 diabetes.',
    salt: 'Metformin',
    saltStrength: '850mg',
  },
  {
    _id: 'med_006',
    name: 'Atorvastatin 20mg',
    category: 'Hypertension',
    type: 'Tablet',
    price: 180,
    stock: 90,
    description: 'Statin medication used to lower cholesterol and reduce cardiovascular risk.',
    salt: 'Atorvastatin',
    saltStrength: '20mg',
  },
  {
    _id: 'med_007',
    name: 'Cetirizine 10mg',
    category: 'Allergy',
    type: 'Tablet',
    price: 60,
    stock: 250,
    description: 'Antihistamine for allergy relief including hay fever and hives.',
    salt: 'Cetirizine',
    saltStrength: '10mg',
  },
  {
    _id: 'med_008',
    name: 'Salbutamol 100mcg Inhaler',
    category: 'Asthma',
    type: 'Inhaler',
    price: 850,
    stock: 45,
    description: 'Bronchodilator for relief of bronchospasm in asthma and COPD.',
    salt: 'Salbutamol',
    saltStrength: '100mcg',
  },
  {
    _id: 'med_009',
    name: 'Augmentin 625mg',
    category: 'Infection',
    type: 'Tablet',
    price: 350,
    stock: 80,
    description: 'Combination antibiotic (amoxicillin + clavulanate) for resistant infections.',
    salt: 'Amoxicillin / Clavulanate',
    saltStrength: '500mg / 125mg',
  },
  {
    _id: 'med_010',
    name: 'Vitamin C 500mg',
    category: 'Supplement',
    type: 'Tablet',
    price: 60,
    stock: 400,
    description: 'Ascorbic acid supplement to support immune function.',
    salt: 'Ascorbic Acid',
    saltStrength: '500mg',
  },
]
