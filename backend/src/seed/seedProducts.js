import { Product } from '../models/Product.js';

export const seedProducts = async () => {
  const count = await Product.count();
  if (count > 0) return;

  await Product.bulkCreate([
    { 
      name: 'Filtro de aceite Toyota', 
      description: 'Filtro compatible con varios modelos Toyota. Protege el motor de impurezas.', 
      price: 12.99, 
      stock: 40, 
      category: 'Filtros', 
      brand: 'Toyota', 
      sku: 'FIL-TOY-001',
      image: 'filtro-toyota.jpg'
    },
    { 
      name: 'Pastillas de freno Brembo', 
      description: 'Juego de pastillas delanteras de alto desempeño. Mayor potencia de frenado.', 
      price: 39.99, 
      stock: 25, 
      category: 'Frenos', 
      brand: 'Brembo', 
      sku: 'FRE-BRE-001',
      image: 'pastillas-brembo.jpg'
    },
    { 
      name: 'Bujías NGK (set x4)', 
      description: 'Encendido eficiente y duradero. Compatibles con motores a gasolina.', 
      price: 22.50, 
      stock: 60, 
      category: 'Motor', 
      brand: 'NGK', 
      sku: 'MOT-NGK-001',
      image: 'bujias-ngk.jpg'
    },
    { 
      name: 'Batería Bosch 12V 60Ah', 
      description: 'Batería de alto rendimiento para autos y camionetas. Arranque seguro en frío.', 
      price: 129.99, 
      stock: 15, 
      category: 'Eléctrico', 
      brand: 'Bosch', 
      sku: 'ELE-BSC-001',
      image: 'bateria-bosch.jpg'
    },
    { 
      name: 'Amortiguadores Monroe (par)', 
      description: 'Amortiguadores delanteros para una conducción suave y controlada.', 
      price: 189.99, 
      stock: 10, 
      category: 'Suspensión', 
      brand: 'Monroe', 
      sku: 'SUS-MON-001',
      image: 'amortiguadores-monroe.jpg'
    },
    { 
      name: 'Discos de freno delanteros', 
      description: 'Discos ventilados compatibles con múltiples marcas de vehículos.', 
      price: 99.99, 
      stock: 20, 
      category: 'Frenos', 
      brand: 'ATE', 
      sku: 'FRE-ATE-001',
      image: 'discos-freno.jpg'
    },
    { 
      name: 'Filtro de aire K&N', 
      description: 'Filtro de alto flujo lavable y reutilizable. Mejora la respuesta del motor.', 
      price: 59.99, 
      stock: 30, 
      category: 'Filtros', 
      brand: 'K&N', 
      sku: 'FIL-KN-001',
      image: 'filtro-kn.jpg'
    },
    { 
      name: 'Radiador de aluminio', 
      description: 'Sistema de enfriamiento eficiente para motor 4 cilindros. Fácil instalación.', 
      price: 210.00, 
      stock: 8, 
      category: 'Refrigeración', 
      brand: 'Valeo', 
      sku: 'REF-VAL-001',
      image: 'radiador-valeo.jpg'
    },
    { 
      name: 'Correa de distribución Gates', 
      description: 'Correa resistente y duradera para motores modernos DOHC.', 
      price: 45.99, 
      stock: 35, 
      category: 'Motor', 
      brand: 'Gates', 
      sku: 'MOT-GAT-001',
      image: 'correa-gates.jpg'
    },
    { 
      name: 'Alternador 90A universal', 
      description: 'Alternador compatible con varias marcas y modelos. Garantía 1 año.', 
      price: 175.50, 
      stock: 12, 
      category: 'Eléctrico', 
      brand: 'Bosch', 
      sku: 'ELE-BSC-002',
      image: 'alternador-bosch.jpg'
    },
    { 
      name: 'Kit de embrague Luk', 
      description: 'Incluye disco, plato de presión y collarín. Para vehículos manuales.', 
      price: 249.99, 
      stock: 6, 
      category: 'Transmisión', 
      brand: 'Luk', 
      sku: 'TRN-LUK-001',
      image: 'kit-embrague-luk.jpg'
    },
    { 
      name: 'Aceite de motor 5W-30 (4L)', 
      description: 'Aceite sintético premium. Protección máxima para motores modernos.', 
      price: 34.99, 
      stock: 80, 
      category: 'Lubricantes', 
      brand: 'Castrol', 
      sku: 'LUB-CAS-001',
      image: 'aceite-castrol.jpg'
    },
  ]);

  console.log('🌱 Productos seed cargados correctamente');
};