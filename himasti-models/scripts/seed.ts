import { randomUUID } from "crypto";
import db from "../utils/dbUtil";
import HakAksesModel from "../models/HakAksesModel";

const ADMIN_USER_IDS = ["b281046d-3638-4d3c-9009-f36c872fd3b9"];

// Harus selaras dengan ConstHelper::OPTION_ROLES di himasti-app
const ALL_ROLES = [
  "Admin",
  "Todo",
  "Profil Organisasi",
  "Banner",
  "Berita",
  "Kegiatan",
  "Divisi",
  "Anggota Divisi",
  "Program Kerja",
  "Dokumentasi",
  "Postingan Instagram",
  "Layanan",
  "Pengaturan",
];

async function seedDB(): Promise<void> {
  try {
    await db.authenticate();
    console.log("Sedang melakukan penyemaian data...");

    for (const userId of ADMIN_USER_IDS) {
      await HakAksesModel.destroy({ where: { user_id: userId } });
      await HakAksesModel.create({
        id: randomUUID(),
        user_id: userId,
        akses: ALL_ROLES.join(","),
      });

      console.log(`Hak akses penuh diberikan untuk user_id: ${userId}`);
    }

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
