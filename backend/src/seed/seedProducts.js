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
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Pastillas de freno Brembo',
      description: 'Juego de pastillas delanteras (alto desempeño).',
      price: 39.99,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Bujías NGK (set x4)',
      description: 'Encendido eficiente y duradero.',
      price: 22.5,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60'
    },

    // 🔽 NUEVOS REPUESTOS 🔽

    {
      name: 'Batería Bosch 12V',
      description: 'Batería de alto rendimiento para autos y camionetas.',
      price: 129.99,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1601924582975-4cc1a41a1d74?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Amortiguadores Monroe (par)',
      description: 'Amortiguadores delanteros para una conducción suave.',
      price: 189.99,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1597008641621-68f1c3f47f5b?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Discos de freno delanteros',
      description: 'Discos ventilados compatibles con múltiples marcas.',
      price: 99.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Filtro de aire K&N',
      description: 'Filtro de alto flujo lavable y reutilizable.',
      price: 59.99,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1581091215367-59ab6f9e1c2f?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Radiador de aluminio',
      description: 'Sistema de enfriamiento eficiente para motor.',
      price: 210.0,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1625047509168-1b3f7fdd06b1?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Correa de distribución Gates',
      description: 'Correa resistente y duradera para motores modernos.',
      price: 45.99,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1620728879666-2d0b63c1b5a5?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Alternador universal',
      description: 'Alternador compatible con varias marcas y modelos.',
      price: 175.5,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1592928309801-46c1d0f4e43a?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Kit de embrague Luk',
      description: 'Incluye disco, plato y collarín.',
      price: 249.99,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1d6?auto=format&fit=crop&w=1200&q=60'
    }
  ]);

  console.log('🌱 Productos seed cargados correctamente ✅');
};
