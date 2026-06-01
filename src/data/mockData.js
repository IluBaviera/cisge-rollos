// ──────────────────────────────────────────────
// CATÁLOGOS
// ──────────────────────────────────────────────

export const CATEGORIAS = {
  hidraulicas: 'Hidráulicas',
  aire_agua: 'Aire / Agua',
  succion: 'Succión',
  otros: 'Otros',
};

export const mangueras = [
  // HIDRÁULICAS
  { id: 'H001', codigo: 'R1-1/4',    nombre: 'SAE 100R1AT 1/4"',    categoria: 'hidraulicas' },
  { id: 'H002', codigo: 'R1-3/8',    nombre: 'SAE 100R1AT 3/8"',    categoria: 'hidraulicas' },
  { id: 'H003', codigo: 'R1-1/2',    nombre: 'SAE 100R1AT 1/2"',    categoria: 'hidraulicas' },
  { id: 'H004', codigo: 'R2-1/4',    nombre: 'SAE 100R2AT 1/4"',    categoria: 'hidraulicas' },
  { id: 'H005', codigo: 'R2-3/8',    nombre: 'SAE 100R2AT 3/8"',    categoria: 'hidraulicas' },
  { id: 'H006', codigo: 'R2-1/2',    nombre: 'SAE 100R2AT 1/2"',    categoria: 'hidraulicas' },
  { id: 'H007', codigo: 'R2-3/4',    nombre: 'SAE 100R2AT 3/4"',    categoria: 'hidraulicas' },
  { id: 'H008', codigo: 'R2-1"',     nombre: 'SAE 100R2AT 1"',      categoria: 'hidraulicas' },
  { id: 'H009', codigo: 'R16-3/8',   nombre: 'SAE 100R16 3/8"',     categoria: 'hidraulicas' },
  { id: 'H010', codigo: 'R16-1/2',   nombre: 'SAE 100R16 1/2"',     categoria: 'hidraulicas' },
  { id: 'H011', codigo: 'R17-1/4',   nombre: 'SAE 100R17 1/4"',     categoria: 'hidraulicas' },
  { id: 'H012', codigo: 'PK471-1/4', nombre: 'Parker 471 1/4"',     categoria: 'hidraulicas' },
  { id: 'H013', codigo: 'PK471-3/8', nombre: 'Parker 471 3/8"',     categoria: 'hidraulicas' },
  { id: 'H014', codigo: 'PK471-1/2', nombre: 'Parker 471 1/2"',     categoria: 'hidraulicas' },
  // AIRE / AGUA
  { id: 'A001', codigo: 'AIRE-3/8',  nombre: 'Manguera Aire 3/8"',  categoria: 'aire_agua' },
  { id: 'A002', codigo: 'AIRE-1/2',  nombre: 'Manguera Aire 1/2"',  categoria: 'aire_agua' },
  { id: 'A003', codigo: 'AIRE-3/4',  nombre: 'Manguera Aire 3/4"',  categoria: 'aire_agua' },
  { id: 'A004', codigo: 'AGUA-1/2',  nombre: 'Manguera Agua 1/2"',  categoria: 'aire_agua' },
  { id: 'A005', codigo: 'AGUA-3/4',  nombre: 'Manguera Agua 3/4"',  categoria: 'aire_agua' },
  { id: 'A006', codigo: 'AGUA-1"',   nombre: 'Manguera Agua 1"',    categoria: 'aire_agua' },
  // SUCCIÓN
  { id: 'S001', codigo: 'SUC-1"',    nombre: 'Succión 1"',          categoria: 'succion' },
  { id: 'S002', codigo: 'SUC-1.5"',  nombre: 'Succión 1-1/2"',      categoria: 'succion' },
  { id: 'S003', codigo: 'SUC-2"',    nombre: 'Succión 2"',          categoria: 'succion' },
  { id: 'S004', codigo: 'ESP-1"',    nombre: 'Espiral Succión 1"',  categoria: 'succion' },
  { id: 'S005', codigo: 'ESP-2"',    nombre: 'Espiral Succión 2"',  categoria: 'succion' },
  // OTROS
  { id: 'O001', codigo: 'GAS-1/4',   nombre: 'Manguera Gas 1/4"',   categoria: 'otros' },
  { id: 'O002', codigo: 'TERM-1/4',  nombre: 'Termoplástica 1/4"',  categoria: 'otros' },
  { id: 'O003', codigo: 'TERM-3/8',  nombre: 'Termoplástica 3/8"',  categoria: 'otros' },
  { id: 'O004', codigo: 'IND-3/4',   nombre: 'Industrial 3/4"',     categoria: 'otros' },
];

export let rollos = [
  // H001 SAE R1 1/4"
  { id: 'R001', manguera_id: 'H001', ubicacion: 'A-1', fecha_ingreso: '2025-01-15', metros_totales: 100, metros_usados: 23.5 },
  { id: 'R002', manguera_id: 'H001', ubicacion: 'A-2', fecha_ingreso: '2025-02-20', metros_totales: 100, metros_usados: 67.0 },
  { id: 'R003', manguera_id: 'H001', ubicacion: 'A-1', fecha_ingreso: '2025-03-10', metros_totales: 100, metros_usados:  0.0 },
  // H002 SAE R1 3/8"
  { id: 'R004', manguera_id: 'H002', ubicacion: 'A-3', fecha_ingreso: '2025-01-20', metros_totales: 100, metros_usados: 45.0 },
  { id: 'R005', manguera_id: 'H002', ubicacion: 'B-1', fecha_ingreso: '2025-04-01', metros_totales: 100, metros_usados: 12.0 },
  // H003 SAE R1 1/2"
  { id: 'R006', manguera_id: 'H003', ubicacion: 'B-2', fecha_ingreso: '2025-01-10', metros_totales: 100, metros_usados: 88.5 },
  { id: 'R007', manguera_id: 'H003', ubicacion: 'B-3', fecha_ingreso: '2025-03-15', metros_totales: 100, metros_usados:  5.0 },
  // H004 SAE R2 1/4"
  { id: 'R008', manguera_id: 'H004', ubicacion: 'C-1', fecha_ingreso: '2025-02-01', metros_totales: 100, metros_usados: 34.0 },
  { id: 'R009', manguera_id: 'H004', ubicacion: 'C-2', fecha_ingreso: '2025-04-10', metros_totales: 100, metros_usados:  0.0 },
  // H005 SAE R2 3/8"
  { id: 'R010', manguera_id: 'H005', ubicacion: 'C-3', fecha_ingreso: '2025-01-05', metros_totales: 100, metros_usados: 78.0 },
  { id: 'R011', manguera_id: 'H005', ubicacion: 'D-1', fecha_ingreso: '2025-02-15', metros_totales: 100, metros_usados: 42.5 },
  { id: 'R012', manguera_id: 'H005', ubicacion: 'D-2', fecha_ingreso: '2025-04-20', metros_totales: 100, metros_usados:  0.0 },
  // H006 SAE R2 1/2"
  { id: 'R013', manguera_id: 'H006', ubicacion: 'D-3', fecha_ingreso: '2025-01-25', metros_totales: 100, metros_usados: 76.5 },
  { id: 'R014', manguera_id: 'H006', ubicacion: 'E-1', fecha_ingreso: '2025-03-05', metros_totales: 100, metros_usados: 23.0 },
  { id: 'R015', manguera_id: 'H006', ubicacion: 'E-2', fecha_ingreso: '2025-05-01', metros_totales: 100, metros_usados:  0.0 },
  // H007 SAE R2 3/4"
  { id: 'R016', manguera_id: 'H007', ubicacion: 'E-3', fecha_ingreso: '2025-02-10', metros_totales:  50, metros_usados: 18.0 },
  { id: 'R017', manguera_id: 'H007', ubicacion: 'F-1', fecha_ingreso: '2025-04-15', metros_totales:  50, metros_usados:  0.0 },
  // H008 SAE R2 1"
  { id: 'R018', manguera_id: 'H008', ubicacion: 'F-2', fecha_ingreso: '2025-03-20', metros_totales:  30, metros_usados:  7.5 },
  // H009 SAE R16 3/8"
  { id: 'R019', manguera_id: 'H009', ubicacion: 'F-3', fecha_ingreso: '2025-01-30', metros_totales: 100, metros_usados: 55.0 },
  { id: 'R020', manguera_id: 'H009', ubicacion: 'G-1', fecha_ingreso: '2025-04-05', metros_totales: 100, metros_usados:  8.0 },
  // H010 SAE R16 1/2"
  { id: 'R021', manguera_id: 'H010', ubicacion: 'G-2', fecha_ingreso: '2025-02-25', metros_totales: 100, metros_usados: 63.0 },
  { id: 'R022', manguera_id: 'H010', ubicacion: 'G-3', fecha_ingreso: '2025-04-28', metros_totales: 100, metros_usados:  0.0 },
  // H011 SAE R17 1/4"
  { id: 'R023', manguera_id: 'H011', ubicacion: 'H-1', fecha_ingreso: '2025-03-01', metros_totales: 100, metros_usados: 29.0 },
  // H012 Parker 471 1/4"
  { id: 'R024', manguera_id: 'H012', ubicacion: 'H-2', fecha_ingreso: '2025-02-05', metros_totales: 100, metros_usados: 47.0 },
  { id: 'R025', manguera_id: 'H012', ubicacion: 'H-3', fecha_ingreso: '2025-04-25', metros_totales: 100, metros_usados:  0.0 },
  // H013 Parker 471 3/8"
  { id: 'R026', manguera_id: 'H013', ubicacion: 'I-1', fecha_ingreso: '2025-03-25', metros_totales: 100, metros_usados: 34.5 },
  // H014 Parker 471 1/2"
  { id: 'R027', manguera_id: 'H014', ubicacion: 'I-2', fecha_ingreso: '2025-01-20', metros_totales: 100, metros_usados: 82.0 },
  { id: 'R028', manguera_id: 'H014', ubicacion: 'I-3', fecha_ingreso: '2025-04-12', metros_totales: 100, metros_usados: 15.0 },
  // Aire/Agua
  { id: 'R029', manguera_id: 'A001', ubicacion: 'J-1', fecha_ingreso: '2025-01-15', metros_totales: 100, metros_usados: 38.0 },
  { id: 'R030', manguera_id: 'A002', ubicacion: 'J-2', fecha_ingreso: '2025-02-20', metros_totales: 100, metros_usados: 56.5 },
  { id: 'R031', manguera_id: 'A002', ubicacion: 'J-3', fecha_ingreso: '2025-04-01', metros_totales: 100, metros_usados:  0.0 },
  { id: 'R032', manguera_id: 'A003', ubicacion: 'K-1', fecha_ingreso: '2025-03-10', metros_totales:  50, metros_usados: 22.0 },
  { id: 'R033', manguera_id: 'A004', ubicacion: 'K-2', fecha_ingreso: '2025-02-01', metros_totales: 100, metros_usados: 71.0 },
  { id: 'R034', manguera_id: 'A005', ubicacion: 'K-3', fecha_ingreso: '2025-04-15', metros_totales:  50, metros_usados:  5.0 },
  { id: 'R035', manguera_id: 'A006', ubicacion: 'L-1', fecha_ingreso: '2025-03-20', metros_totales:  30, metros_usados: 18.0 },
  // Succión
  { id: 'R036', manguera_id: 'S001', ubicacion: 'L-2', fecha_ingreso: '2025-01-25', metros_totales:  30, metros_usados: 12.0 },
  { id: 'R037', manguera_id: 'S002', ubicacion: 'L-3', fecha_ingreso: '2025-02-15', metros_totales:  30, metros_usados:  8.5 },
  { id: 'R038', manguera_id: 'S003', ubicacion: 'M-1', fecha_ingreso: '2025-03-05', metros_totales:  20, metros_usados:  4.0 },
  { id: 'R039', manguera_id: 'S003', ubicacion: 'M-2', fecha_ingreso: '2025-04-20', metros_totales:  20, metros_usados:  0.0 },
  { id: 'R040', manguera_id: 'S004', ubicacion: 'M-3', fecha_ingreso: '2025-02-28', metros_totales:  20, metros_usados:  9.0 },
  { id: 'R041', manguera_id: 'S005', ubicacion: 'N-1', fecha_ingreso: '2025-04-08', metros_totales:  15, metros_usados:  0.0 },
  // Otros
  { id: 'R042', manguera_id: 'O001', ubicacion: 'N-2', fecha_ingreso: '2025-01-10', metros_totales: 100, metros_usados: 43.0 },
  { id: 'R043', manguera_id: 'O002', ubicacion: 'N-3', fecha_ingreso: '2025-02-20', metros_totales: 100, metros_usados: 67.5 },
  { id: 'R044', manguera_id: 'O002', ubicacion: 'O-1', fecha_ingreso: '2025-04-30', metros_totales: 100, metros_usados:  0.0 },
  { id: 'R045', manguera_id: 'O003', ubicacion: 'O-2', fecha_ingreso: '2025-03-15', metros_totales: 100, metros_usados: 28.0 },
  { id: 'R046', manguera_id: 'O004', ubicacion: 'O-3', fecha_ingreso: '2025-04-22', metros_totales:  50, metros_usados: 11.0 },
];

export const complementosCatalogo = [
  { id: 'FIT001', codigo: 'JIC-M-1/4',  nombre: 'Fitting JIC 1/4" Macho' },
  { id: 'FIT002', codigo: 'JIC-H-1/4',  nombre: 'Fitting JIC 1/4" Hembra' },
  { id: 'FIT003', codigo: 'JIC-M-3/8',  nombre: 'Fitting JIC 3/8" Macho' },
  { id: 'FIT004', codigo: 'JIC-H-3/8',  nombre: 'Fitting JIC 3/8" Hembra' },
  { id: 'FIT005', codigo: 'JIC-M-1/2',  nombre: 'Fitting JIC 1/2" Macho' },
  { id: 'FIT006', codigo: 'JIC-H-1/2',  nombre: 'Fitting JIC 1/2" Hembra' },
  { id: 'FIT007', codigo: 'NPT-M-1/4',  nombre: 'Conector NPT 1/4" Macho' },
  { id: 'FIT008', codigo: 'NPT-M-3/8',  nombre: 'Conector NPT 3/8" Macho' },
  { id: 'FIT009', codigo: 'NPT-M-1/2',  nombre: 'Conector NPT 1/2" Macho' },
  { id: 'FIT010', codigo: 'BANJO-1/4',  nombre: 'Fitting Banjo 1/4"' },
  { id: 'FIT011', codigo: 'CODO-90-1/4',nombre: 'Codo 90° 1/4"' },
  { id: 'FIT012', codigo: 'CODO-90-3/8',nombre: 'Codo 90° 3/8"' },
  { id: 'FIT013', codigo: 'CODO-90-1/2',nombre: 'Codo 90° 1/2"' },
];

export const productosCatalogo = [
  { id: 'PS001', codigo: 'CLZ-M8',    nombre: 'Collarín M8',           unidad: 'pza' },
  { id: 'PS002', codigo: 'CLZ-M10',   nombre: 'Collarín M10',          unidad: 'pza' },
  { id: 'PS003', codigo: 'CLZ-M12',   nombre: 'Collarín M12',          unidad: 'pza' },
  { id: 'PS004', codigo: 'ABR-1/2',   nombre: 'Abrazadera 1/2"',       unidad: 'pza' },
  { id: 'PS005', codigo: 'ABR-3/4',   nombre: 'Abrazadera 3/4"',       unidad: 'pza' },
  { id: 'PS006', codigo: 'ABR-1',     nombre: 'Abrazadera 1"',         unidad: 'pza' },
  { id: 'PS007', codigo: 'TEF-12M',   nombre: 'Cinta Teflón 12m',      unidad: 'rollo' },
  { id: 'PS008', codigo: 'LUBT-500',  nombre: 'Lubricante Tuerca 500ml',unidad: 'frasco' },
  { id: 'PS009', codigo: 'MPROT-1/2', nombre: 'Manga Protectora 1/2"', unidad: 'm' },
  { id: 'PS010', codigo: 'SOP-HID',   nombre: 'Soporte Hidráulico',    unidad: 'pza' },
];

// ──────────────────────────────────────────────
// PEDIDOS (con estado mutable en módulo para la demo)
// ──────────────────────────────────────────────

const T = Date.now();

export let pedidos = [
  {
    id: 'PED-001',
    cliente: 'Taller Mecánico Juárez',
    estado: 'urgente',
    hora: '08:30',
    timestamp: T - 52 * 60 * 1000,
    items_resumen: { ensambles: 2, mangueras_sueltas: 1, productos_sueltos: 3 },
    ensambles: [
      {
        id: 'ENS-001-1',
        nombre: 'Ensamble R2-1/2" × 80 cm',
        manguera_id: 'H006',
        metros: 0.80,
        rollo_asignado: 'R013',
        complementos: [
          { complemento_id: 'FIT005', cantidad: 1, incluido: true },
          { complemento_id: 'FIT006', cantidad: 1, incluido: true },
        ],
      },
      {
        id: 'ENS-001-2',
        nombre: 'Ensamble R1-3/8" × 1.2 m',
        manguera_id: 'H002',
        metros: 1.20,
        rollo_asignado: 'R004',
        complementos: [
          { complemento_id: 'FIT003', cantidad: 1, incluido: true },
          { complemento_id: 'FIT004', cantidad: 1, incluido: true },
          { complemento_id: 'FIT012', cantidad: 1, incluido: false },
        ],
      },
    ],
    mangueras_sueltas: [
      { manguera_id: 'H001', metros: 3.5, rollo_asignado: 'R001' },
    ],
    productos_sueltos: [
      { producto_id: 'PS003', cantidad: 4 },
      { producto_id: 'PS004', cantidad: 2 },
      { producto_id: 'PS007', cantidad: 1 },
    ],
  },
  {
    id: 'PED-002',
    cliente: 'Constructora Hernández',
    estado: 'urgente',
    hora: '09:15',
    timestamp: T - 28 * 60 * 1000,
    items_resumen: { ensambles: 1, mangueras_sueltas: 0, productos_sueltos: 2 },
    ensambles: [
      {
        id: 'ENS-002-1',
        nombre: 'Ensamble Parker 471 1/2" × 60 cm',
        manguera_id: 'H014',
        metros: 0.60,
        rollo_asignado: 'R027',
        complementos: [
          { complemento_id: 'FIT005', cantidad: 2, incluido: true },
        ],
      },
    ],
    mangueras_sueltas: [],
    productos_sueltos: [
      { producto_id: 'PS005', cantidad: 3 },
      { producto_id: 'PS007', cantidad: 2 },
    ],
  },
  {
    id: 'PED-003',
    cliente: 'PEMEX — Refinería',
    estado: 'pendiente',
    hora: '10:00',
    timestamp: T - 15 * 60 * 1000,
    items_resumen: { ensambles: 3, mangueras_sueltas: 2, productos_sueltos: 0 },
    ensambles: [
      {
        id: 'ENS-003-1',
        nombre: 'Ensamble Succión 2" × 2 m',
        manguera_id: 'S003',
        metros: 2.00,
        rollo_asignado: 'R038',
        complementos: [
          { complemento_id: 'FIT009', cantidad: 2, incluido: true },
        ],
      },
      {
        id: 'ENS-003-2',
        nombre: 'Ensamble R2-3/4" × 1.5 m',
        manguera_id: 'H007',
        metros: 1.50,
        rollo_asignado: 'R016',
        complementos: [
          { complemento_id: 'FIT006', cantidad: 1, incluido: true },
          { complemento_id: 'FIT009', cantidad: 1, incluido: true },
          { complemento_id: 'FIT013', cantidad: 1, incluido: false },
        ],
      },
      {
        id: 'ENS-003-3',
        nombre: 'Ensamble R2-1/2" × 2.5 m',
        manguera_id: 'H006',
        metros: 2.50,
        rollo_asignado: 'R014',
        complementos: [
          { complemento_id: 'FIT005', cantidad: 1, incluido: true },
          { complemento_id: 'FIT006', cantidad: 1, incluido: true },
        ],
      },
    ],
    mangueras_sueltas: [
      { manguera_id: 'H001', metros: 5.0, rollo_asignado: 'R003' },
      { manguera_id: 'A002', metros: 3.0, rollo_asignado: 'R030' },
    ],
    productos_sueltos: [],
  },
  {
    id: 'PED-004',
    cliente: 'Maquinaria Industrial Pérez',
    estado: 'pendiente',
    hora: '10:45',
    timestamp: T - 5 * 60 * 1000,
    items_resumen: { ensambles: 0, mangueras_sueltas: 3, productos_sueltos: 5 },
    ensambles: [],
    mangueras_sueltas: [
      { manguera_id: 'H005', metros:  8.0, rollo_asignado: 'R011' },
      { manguera_id: 'A001', metros: 12.0, rollo_asignado: 'R029' },
      { manguera_id: 'S001', metros:  4.5, rollo_asignado: 'R036' },
    ],
    productos_sueltos: [
      { producto_id: 'PS001', cantidad: 10 },
      { producto_id: 'PS004', cantidad:  6 },
      { producto_id: 'PS006', cantidad:  4 },
      { producto_id: 'PS007', cantidad:  3 },
      { producto_id: 'PS008', cantidad:  1 },
    ],
  },
  {
    id: 'PED-005',
    cliente: 'Auto Taller El Pino',
    estado: 'pendiente',
    hora: '11:20',
    timestamp: T - 1 * 60 * 1000,
    items_resumen: { ensambles: 1, mangueras_sueltas: 0, productos_sueltos: 1 },
    ensambles: [
      {
        id: 'ENS-005-1',
        nombre: 'Ensamble R1-1/4" × 30 cm',
        manguera_id: 'H001',
        metros: 0.30,
        rollo_asignado: 'R001',
        complementos: [
          { complemento_id: 'FIT001', cantidad: 1, incluido: true },
          { complemento_id: 'FIT002', cantidad: 1, incluido: true },
        ],
      },
    ],
    mangueras_sueltas: [],
    productos_sueltos: [
      { producto_id: 'PS007', cantidad: 1 },
    ],
  },
];

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

export const getRolloDisponible = r => r.metros_totales - r.metros_usados;

export const getManguera   = id => mangueras.find(m => m.id === id);
export const getRollo      = id => rollos.find(r => r.id === id);
export const getComplemento= id => complementosCatalogo.find(c => c.id === id);
export const getProducto   = id => productosCatalogo.find(p => p.id === id);
export const getPedido     = id => pedidos.find(p => p.id === id);

export const getRollosByManguera = mangueraId =>
  rollos.filter(r => r.manguera_id === mangueraId);

export const getMetrosDisponibles = mangueraId =>
  getRollosByManguera(mangueraId).reduce((s, r) => s + getRolloDisponible(r), 0);

export const getRollosElegibles = (mangueraId, metros) =>
  getRollosByManguera(mangueraId)
    .filter(r => getRolloDisponible(r) >= metros)
    .sort((a, b) => {
      const sa = getRolloDisponible(a) - metros;
      const sb = getRolloDisponible(b) - metros;
      return sa - sb;
    });

export const minutosTranscurridos = ts => Math.floor((Date.now() - ts) / 60000);

export const formatFecha = iso => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const formatMin = mins => {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

// Mutar rollo asignado en un pedido (para demo interactiva)
export const cambiarRolloEnPedido = (pedidoId, tipo, itemKey, nuevoRolloId) => {
  const ped = pedidos.find(p => p.id === pedidoId);
  if (!ped) return;
  if (tipo === 'ensamble') {
    const ens = ped.ensambles.find(e => e.id === itemKey);
    if (ens) ens.rollo_asignado = nuevoRolloId;
  } else {
    const idx = parseInt(itemKey, 10);
    if (ped.mangueras_sueltas[idx]) ped.mangueras_sueltas[idx].rollo_asignado = nuevoRolloId;
  }
};

// Agregar rollo (para vista Ingresos)
export const agregarRollo = ({ manguera_id, metros, ubicacion }) => {
  const id = `R${String(rollos.length + 1).padStart(3, '0')}`;
  rollos = [...rollos, {
    id,
    manguera_id,
    ubicacion,
    fecha_ingreso: new Date().toISOString().slice(0, 10),
    metros_totales: metros,
    metros_usados: 0,
  }];
  return id;
};

export const ingresosDelDia = [
  { id: 'ING001', manguera_id: 'H001', metros: 100, ubicacion: 'A-1', referencia: 'OC-2025-042', hora: '08:15' },
  { id: 'ING002', manguera_id: 'H006', metros: 100, ubicacion: 'E-2', referencia: 'OC-2025-042', hora: '08:22' },
  { id: 'ING003', manguera_id: 'A002', metros: 100, ubicacion: 'J-3', referencia: '',             hora: '09:48' },
];
