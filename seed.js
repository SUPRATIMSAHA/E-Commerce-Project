const Product = require("./models/product");

const products = [
  {
    name: "T-Shirt",
    img:
      "https://images.unsplash.com/photo-1597599120855-a68865fd4884?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTczfHx0JTIwc2hpcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 1500,
    desc:
      "A T-shirt, or tee shirt, is a style of fabric shirt named after the T shape of its body and sleeves. Traditionally, it has short sleeves and a round neckline, known as a crew neck, which lacks a collar. T-shirts are generally made of a stretchy, light and inexpensive fabric and are easy to clean. The T-shirt evolved from undergarments used in the 19th century and, in the mid-20th century, transitioned from undergarment to general-use casual clothing.",
  },
  {
    name: "I-Phone7",
    img:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGklMjBwaG9uZSUyMDd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 80000,
    desc:
      "Apple iPhone 7 smartphone was launched in September 2016. The phone comes with a 4.70-inch touchscreen display with a resolution of 750x1334 pixels at a pixel density of 326 pixels per inch (ppi) and an aspect ratio of 16:9. Apple iPhone 7 is powered by a 2.34GHz quad-core Apple A10 Fusion processor. It comes with 2GB of RAM. The Apple iPhone 7 runs iOS 10 and is powered by a 1960mAh non-removable battery. As far as the cameras are concerned, the Apple iPhone 7 on the rear packs a 12-megapixel camera with an f/1.8 aperture. The rear camera setup has phase detection autofocus. It sports a 7-megapixel camera on the front for selfies with an f/2.2 aperture. Apple iPhone 7 is based on iOS 10 and packs 32GB of inbuilt storage. The Apple iPhone 7 is a single SIM (GSM) smartphone that accepts a Nano-SIM card. The Apple iPhone 7 measures 138.30 x 67.10 x 7.10mm (height x width x thickness) and weighs 138.00 grams. It was launched in Black, Gold, Jet Black, Matte Black, Red, Rose Gold, and Silver colours. Connectivity options on the Apple iPhone 7 include Wi-Fi 802.11 a/b/g/n/ac, GPS, Bluetooth v4.20, NFC, Lightning, 3G, and 4G (with support for Band 40 used by some LTE networks in India). Sensors on the phone include accelerometer, ambient light sensor, barometer, compass/ magnetometer, gyroscope, proximity sensor, and fingerprint sensor. As of 27th April 2021, Apple iPhone 7 price in India starts at Rs. 24,999.",
  },
  {
    name: "MacBook Pro",
    img:
      "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFjYm9va3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 150000,
    desc:
      "Apple MacBook Pro is a macOS laptop with a 13.30-inch display that has a resolution of 2560x1600 pixels. It is powered by a Core i5 processor and it comes with 12GB of RAM. The Apple MacBook Pro packs 512GB of SSD storage.",
  },
  {
    name: "BoAt HeadPhone",
    img:
      "https://images.unsplash.com/photo-1491927570842-0261e477d937?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhlYWRwaG9uZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 1500,
    desc:
      "It’s time to rock your lives with Rockerz 450 Pro. Get astounded and feel every beat with these bluetooth headphones that are here to make music more fun. With 40mm drivers and the unbeatable boAt Signature sound, groove to your favourite music. Make work and workouts more fun with a mountainous playback time of 70 hours that never gives up on you. With charging just for 10 minutes, enjoy music and your binge sessions non stop for 10 hours! It is time for you to get fresh on fashion and high on comfort with Rockerz 450 Pro.",
  },
  {
    name: "Shoes",
    img:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 4000,
    desc:
      "NIKE, named for the Greek goddess of victory, is a shoe and apparel company. It designs, develops, and sells a variety of products to help in playing basketball and soccer (football), as well as in running, men's and women's training, and other action sports.",
  },
  {
    name: "AXE Deodorant",
    img:
      "https://images.unsplash.com/photo-1606389682798-d265ff6600df?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXhlJTIwZGVvZG9yYW50fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 1000,
    desc:
      "Sweet, rich, spicy and dark – the aromas of chocolate are irresistible. With notes of Amber and Peppercorn added to a smooth chocolate-scented base, the Axe Dark Temptation body spray deodorant for men gives you a taste of the pleasures that chocolate holds.",
  },
  {
    name: "Refrigerator",
    img:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmVmcmlnZXJhdG9yfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 25000,
    desc:
      "A refrigerator (colloquially fridge) is a home appliance consisting of a thermally insulated compartment and a heat pump (mechanical, electronic or chemical) that transfers heat from its inside to its external environment so that its inside is cooled to a temperature below the room temperature.",
  },
  {
    name: "Trimmer",
    img:
      "https://images.unsplash.com/photo-1618247140092-c9278ce7fc9f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpbW1lcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 2000,
    desc:
      "A trimmer is a miniature adjustable electrical component. It is meant to be set correctly when installed in some device, and never seen or adjusted by the device's user. Trimmers can be variable resistors (potentiometers), variable capacitors, or trimmable inductors.",
  },
  {
    name: "Sunglasses",
    img:
      "https://images.unsplash.com/photo-1610904347227-94142558dfa8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHN1bmdsYXNzZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: 500,
    desc:
      "Sunglasses or sun glasses (informally called shades or sunnies; more names below) are a form of protective eyewear designed primarily to prevent bright sunlight and high-energy visible light from damaging or discomforting the eyes.",
  },
];

const seedDB = async () => {
  await Product.insertMany(products);
  console.log("DB Seeded");
};

module.exports = seedDB;
