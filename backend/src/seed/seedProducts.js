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
      image: 'https://images.unsplash.com/photo-1611566026373-c6c8da0bc061?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Pastillas de freno Brembo',
      description: 'Juego de pastillas delanteras (alto desempeño).',
      price: 39.99,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1635448095662-8e1f1ee0ea3c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Bujías NGK (set x4)',
      description: 'Encendido eficiente y duradero.',
      price: 22.5,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1620939511105-08149d53496c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Batería Bosch 12V',
      description: 'Batería de alto rendimiento para autos y camionetas.',
      price: 129.99,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1619641782821-161ae3d120a1?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Amortiguadores Monroe (par)',
      description: 'Amortiguadores delanteros para una conducción suave.',
      price: 189.99,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Discos de freno delanteros',
      description: 'Discos ventilados compatibles con múltiples marcas.',
      price: 99.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Filtro de aire K&N',
      description: 'Filtro de alto flujo lavable y reutilizable.',
      price: 59.99,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1612531388260-25e98f64127c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Radiador de aluminio',
      description: 'Sistema de enfriamiento eficiente para motor.',
      price: 210.0,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Correa de distribución Gates',
      description: 'Correa resistente y duradera para motores modernos.',
      price: 45.99,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1632733711679-539da695ADfe?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Alternador universal',
      description: 'Alternador compatible con varias marcas y modelos.',
      price: 175.5,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1635843231362-e61309837920?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Kit de embrague Luk',
      description: 'Incluye disco, plato y collarín.',
      price: 249.99,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1611634503792-75d8da9f24ba?auto=format&fit=crop&w=1200&q=80'
    }
  ]);

  console.log('🌱 Productos seed cargados correctamente ✅');
};