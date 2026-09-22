export const MARCAS_BOMBA = [
  "Grundfos",
  "KSB",
  "Flygt",
  "Ebara",
  "Rotor Pump",
  "Vulcan",
  "Wilo"
];

export const MODELOS_BOMBA = {
  "Grundfos": ["CR 10-02", "CR 15-03", "NB 50-160", "TP 80-240"],
  "KSB": ["Etanorm 050-032-160", "Etabloc 065-200", "Amarex KRT", "MegaCPK"],
  "Flygt": ["NP 3153", "CP 3085", "FP 3127", "N 3127"],
  "Ebara": ["3M 40-160", "DVS 50", "BEST ONE", "CDX 70/05"],
  "Rotor Pump": ["RP-50", "RP-75 Turbo", "RP Centrífuga 100"],
  "Vulcan": ["V-Series 100", "V-Series 200"],
  "Wilo": ["MHI 404", "IL 50/110", "CronoNorm NL"]
};

export const MARCAS_SELLO_COMPETIDOR = [
  "John Crane",
  "Burgmann",
  "Roten",
  "AESSEAL",
  "Pac-Seal",
  "Vulcan",
  "Chesterton"
];

export const TIPOS_FLUIDO = [
  "Agua limpia / Potable",
  "Químicos agresivos / Ácidos",
  "Aceites y fluidos viscosos",
  "Aguas residuales / Cloacales",
  "Alimentos y bebidas (Grado alimenticio)"
];

export const GUIA_COMPATIBILIDAD_FLUIDOS = {
  "Agua limpia / Potable": {
    nivelRiesgo: "Bajo",
    materialesRecomendados: "Carbón / Cerámica / NBR o EPDM",
    advertencia: "Condición estándar de bombeo. Apto para sellos con elastómeros NBR/EPDM.",
    icono: "💧",
    colorBadge: "#10B981"
  },
  "Químicos agresivos / Ácidos": {
    nivelRiesgo: "Crítico / Alto",
    materialesRecomendados: "Carburo de Silicio / Silicio (SiC/SiC) + Vitón o Kalrez",
    advertencia: "⚠️ ALERTA QUÍMICA: Prohibido usar caras blandas (carbón/cerámica) o elastómeros NBR. Riesgo de degradación y fuga.",
    icono: "🧪",
    colorBadge: "#EF4444"
  },
  "Aceites y fluidos viscosos": {
    nivelRiesgo: "Medio",
    materialesRecomendados: "Carburo de Silicio / Carbón + Vitón (FKM)",
    advertencia: "Requiere resortes reforzados y elastómeros FKM resistentes a hidrocarburos y temperatura.",
    icono: "🛢️",
    colorBadge: "#F59E0B"
  },
  "Aguas residuales / Cloacales": {
    nivelRiesgo: "Alto (Abrasivo)",
    materialesRecomendados: "Carburo de Tungsteno / Carburo de Silicio + Vitón",
    advertencia: "⚠️ ALERTA ABRASIÓN: Fluidos con partículas en suspensión requieren caras de extrema dureza para evitar desgaste prematuro.",
    icono: "☣️",
    colorBadge: "#D97706"
  },
  "Alimentos y bebidas (Grado alimenticio)": {
    nivelRiesgo: "Sanitario / FDA",
    materialesRecomendados: "Carbón / Cerámica o SiC + EPDM Grado Alimenticio / PTFE",
    advertencia: "Materiales certificados aptos para contacto con alimentos. Evitar elastómeros que liberen trazas.",
    icono: "🥛",
    colorBadge: "#3B82F6"
  }
};


export const SELLOS_REPUESSTOS = [
  {
    id: "GRA-T21-25",
    codigoEquivalente: "Graphite Sello Tipo 21",
    equivalenteCompetidor: "John Crane Type 21 / Vulcan Type 21",
    marcaSelloCompetidor: "John Crane",
    tipoSelloCompetidor: "Type 21",
    marcaBombaCompatible: "Grundfos",
    modeloBombaCompatible: "CR 10-02",
    diametroEje: "25 mm",
    diametroEjeNum: 25,
    diametroExtNum: 41,
    longitudNum: 35,
    medidasDetalle: "Eje: 25mm | Ext: 41mm | Longitud: 35mm",
    color: "Inoxidable con Cara Negra Carbón",
    materiales: "Carbón / Carburo de Silicio / Vitón",
    carasMaterial: "Carbón vs SiC",
    elastomeroMaterial: "Vitón (FKM)",
    presionMax: "12 bar (175 PSI)",
    temperaturaMax: "-20°C a +150°C",
    velocidadMax: "13 m/s",
    fluidosAptos: ["Agua limpia / Potable", "Aceites y fluidos viscosos"],
    imagen: "https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png"
  },
  {
    id: "GRA-MG1-30",
    codigoEquivalente: "Graphite Sello MG1",
    equivalenteCompetidor: "Burgmann MG1 / Vulcan Type 19",
    marcaSelloCompetidor: "Burgmann",
    tipoSelloCompetidor: "MG1",
    marcaBombaCompatible: "KSB",
    modeloBombaCompatible: "Etanorm 050-032-160",
    diametroEje: "30 mm",
    diametroEjeNum: 30,
    diametroExtNum: 45,
    longitudNum: 40,
    medidasDetalle: "Eje: 30mm | Ext: 45mm | Longitud: 40mm",
    color: "Plata Brillante / O-ring Negro EPDM",
    materiales: "Carburo de Silicio / Silicio / EPDM",
    carasMaterial: "SiC vs SiC (Silicio/Silicio)",
    elastomeroMaterial: "EPDM Reforzado",
    presionMax: "16 bar (230 PSI)",
    temperaturaMax: "-30°C a +180°C",
    velocidadMax: "15 m/s",
    fluidosAptos: ["Químicos agresivos / Ácidos", "Agua limpia / Potable"],
    imagen: "https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png"
  },
  {
    id: "GRA-ROT3-35",
    codigoEquivalente: "Graphite Sello Roten 3",
    equivalenteCompetidor: "Roten Type 3 / Pac-Seal 16",
    marcaSelloCompetidor: "Roten",
    tipoSelloCompetidor: "Type 3",
    marcaBombaCompatible: "Flygt",
    modeloBombaCompatible: "NP 3153",
    diametroEje: "35 mm",
    diametroEjeNum: 35,
    diametroExtNum: 52,
    longitudNum: 42,
    medidasDetalle: "Eje: 35mm | Ext: 52mm | Longitud: 42mm",
    color: "Metálico Pesado / Elastómero Marrón Vitón",
    materiales: "Carburo de Tungsteno / Vitón / AISI 316",
    carasMaterial: "Carburo de Tungsteno (TC)",
    elastomeroMaterial: "Vitón (FKM)",
    presionMax: "20 bar (290 PSI)",
    temperaturaMax: "-15°C a +200°C",
    velocidadMax: "20 m/s",
    fluidosAptos: ["Aguas residuales / Cloacales"],
    imagen: "https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png"
  },
  {
    id: "GRA-502-20",
    codigoEquivalente: "Graphite Sello Tipo 502",
    equivalenteCompetidor: "John Crane Type 502 / AESSEAL B07",
    marcaSelloCompetidor: "John Crane",
    tipoSelloCompetidor: "Type 502",
    marcaBombaCompatible: "Ebara",
    modeloBombaCompatible: "3M 40-160",
    diametroEje: "20 mm",
    diametroEjeNum: 20,
    diametroExtNum: 36,
    longitudNum: 30,
    medidasDetalle: "Eje: 20mm | Ext: 36mm | Longitud: 30mm",
    color: "Inoxidable / Blanco Cerámico",
    materiales: "Carbón / Cerámica / NBR",
    carasMaterial: "Carbón vs Cerámica",
    elastomeroMaterial: "NBR Estándar",
    presionMax: "10 bar (145 PSI)",
    temperaturaMax: "-20°C a +120°C",
    velocidadMax: "10 m/s",
    fluidosAptos: ["Agua limpia / Potable", "Alimentos y bebidas (Grado alimenticio)"],
    imagen: "https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png"
  },
  {
    id: "GRA-H7N-40",
    codigoEquivalente: "Graphite Sello H7N High Temp",
    equivalenteCompetidor: "Burgmann H7N / Vulcan Type 1677",
    marcaSelloCompetidor: "Burgmann",
    tipoSelloCompetidor: "H7N",
    marcaBombaCompatible: "KSB",
    modeloBombaCompatible: "Etabloc 065-200",
    diametroEje: "40 mm",
    diametroEjeNum: 40,
    diametroExtNum: 58,
    longitudNum: 50,
    medidasDetalle: "Eje: 40mm | Ext: 58mm | Longitud: 50mm",
    color: "Acero Mate / Kalrez Negro",
    materiales: "Carburo de Silicio / Carbón / Kalrez",
    carasMaterial: "SiC vs Carbón Resin",
    elastomeroMaterial: "Kalrez (FFKM)",
    presionMax: "25 bar (360 PSI)",
    temperaturaMax: "-40°C a +220°C",
    velocidadMax: "25 m/s",
    fluidosAptos: ["Químicos agresivos / Ácidos", "Aceites y fluidos viscosos"],
    imagen: "https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png"
  }
];

export const MOCK_LEADS_CONSULTAS = [
  {
    id: "LEAD-101",
    fecha: "2026-09-02 14:15",
    cliente: "Industrias Químicas del Norte S.A.",
    contacto: "Carlos Gómez (Ing. Mantenimiento)",
    mail: "cgomez@iquimicas.com.ar",
    telefono: "11 4512-8890",
    selloBuscado: "GRA-MG1-30 (Silicio/Silicio)",
    bomba: "KSB Etanorm 050-032",
    estado: "Pendiente",
    origen: "Formulario Web"
  },
  {
    id: "LEAD-102",
    fecha: "2026-09-02 13:40",
    cliente: "Frigorífico Avellaneda",
    contacto: "Mariana Páez (Planta)",
    mail: "mpaez@frioavellaneda.com",
    telefono: "11 3813-4174",
    selloBuscado: "GRA-T21-25 (John Crane T21)",
    bomba: "Grundfos CR 10-02",
    estado: "En Cotización",
    origen: "WhatsApp Directo"
  },
  {
    id: "LEAD-103",
    fecha: "2026-09-01 18:20",
    cliente: "Petroquímica Ensenada",
    contacto: "Ing. Esteban Rossi",
    mail: "erossi@pensenada.com.ar",
    telefono: "221 488-1234",
    selloBuscado: "GRA-SE2-45 Cartucho Doble",
    bomba: "Flygt FP 3127",
    estado: "Respondido",
    origen: "Formulario Web"
  }
];
