/** Service/category banner images */
export const CATEGORY_IMAGES = {
  Painter: 'https://i.postimg.cc/mDzJnkM8/63ba8b45cada2398686def9c0e65dfb4.jpg',
  Mason: 'https://i.postimg.cc/L5sRh2ZP/mistrigo-service-4.jpg',
  Carpenter: 'https://i.postimg.cc/mDqfZq7Z/70d2a5bfb09edcb66b7507e1a3e199ec.jpg',
  Gardener: 'https://i.postimg.cc/TPNYmtnF/0d5bd5a42a1515a777a5aa78c262f3ff.jpg',
  Mechanic: 'https://i.postimg.cc/G2jKqshW/18d5f056fbc328adb749d7d26f85015c.jpg',
  Electrician: 'https://i.postimg.cc/SKhc3N5k/fd9e17611fe11d0a220f7f609300b676.jpg',
  Plumber: 'https://i.postimg.cc/Fsq5Q1jt/303cad3e61f6a6b34c2971033f165053.jpg',
  Welder: 'https://i.postimg.cc/ZKJFKLxp/f72094d6275dbbf37341f6d8e9436d68.jpg',
  'House Worker': 'https://i.postimg.cc/0QXprgk4/29ae1842f9b468128aef7ca565080824.jpg',
  'AC Technician': 'https://i.postimg.cc/SKhc3N5k/fd9e17611fe11d0a220f7f609300b676.jpg',
  Driver: 'https://i.postimg.cc/0QXprgk4/29ae1842f9b468128aef7ca565080824.jpg',
};

export const getCategoryImage = (category) => CATEGORY_IMAGES[category] || '';
