const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanUsers() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('promptlearn');
    const users = db.collection('users');

    // Gereksiz alanları kaldır ama diğer verileri koru
    const result = await users.updateMany(
      {},
      {
        $unset: {
          hashed_password: "",
          disabled: "",
          password: ""
        }
      }
    );

    console.log(`${result.modifiedCount} kullanıcı güncellendi`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB bağlantısı kapatıldı');
  }
}

cleanUsers(); 