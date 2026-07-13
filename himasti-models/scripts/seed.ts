import db from "../utils/dbUtil";
import HakAksesModel from "../models/HakAksesModel";

async function seedDB(): Promise<void> {
  try {
    await db.authenticate();
    console.log("Sedang melakukan penyemaian data...");

    // Tambahkan logika penyemaian data di sini
    const user_id = "32035507-89b7-448e-96a0-af576139a1f6";
    await HakAksesModel.destroy({ where: { user_id: user_id } });
    await HakAksesModel.create({
      id: user_id,
      user_id: user_id,
      akses: "Admin",
    });

    console.log("Berhasil melakukan penyemaian database.");
  } catch (error) {
    console.error("Gagal melakukan penyemaian database: ", error);
  } finally {
    await db.close();
  }
}

(async () => {
  await seedDB();
})();
