import { Product } from '../models/Product.js';

export const seedProducts = async () => {
  const count = await Product.count();
  if (count > 0) return;

  await Product.bulkCreate([
    {
      name: 'Filtro de aceite Toyota',
      description: 'Filtro compatible con varios modelos Toyota.',
      price: 12.99,
      stock: 40,
      image: 'filtro-toyota.jpg'
    },
    {
      name: 'Pastillas de freno Brembo',
      description: 'Juego de pastillas delanteras (alto desempeño).',
      price: 39.99,
      stock: 25,
      image: 'pastillas-brembo.jpg'
    },
    {
      name: 'Bujías NGK (set x4)',
      description: 'Encendido eficiente y duradero.',
      price: 22.5,
      stock: 60,
      image: 'bujias-ngk.jpg'
    },
    {
      name: 'Batería Bosch 12V',
      description: 'Batería de alto rendimiento para autos y camionetas.',
      price: 129.99,
      stock: 15,
      image: 'bateria-bosch.jpg'
    },
    {
      name: 'Amortiguadores Monroe (par)',
      description: 'Amortiguadores delanteros para una conducción suave.',
      price: 189.99,
      stock: 10,
      image: 'amortiguadores-monroe.jpg'
    },
    {
      name: 'Discos de freno delanteros',
      description: 'Discos ventilados compatibles con múltiples marcas.',
      price: 99.99,
      stock: 20,
      image: 'discos-freno.jpg'
    },
    {
      name: 'Filtro de aire K&N',
      description: 'Filtro de alto flujo lavable y reutilizable.',
      price: 59.99,
      stock: 30,
      image: 'filtro-kn.jpg'
    },
    {
      name: 'Radiador de aluminio',
      description: 'Sistema de enfriamiento eficiente para motor.',
      price: 210.0,
      stock: 8,
      image: 'radiador.jpg'
    },
    {
      name: 'Correa de distribución Gates',
      description: 'Correa resistente y duradera para motores modernos.',
      price: 45.99,
      stock: 35,
      image: 'correa-gates.jpg'
    },
    {
      name: 'Alternador universal',
      description: 'Alternador compatible con varias marcas y modelos.',
      price: 175.5,
      stock: 12,
      image: 'alternador.jpg'
    },
    {
      name: 'Kit de embrague Luk',
      description: 'Incluye disco, plato y collarín.',
      price: 249.99,
      stock: 6,
      image: 'kit-embrague.jpg'
    }
  ]);

  console.log('🌱 Productos seed cargados correctamente ✅');
};