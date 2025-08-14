import fs from "fs";
import ExcelJS from "exceljs";
import { rooms } from "./room.js";

// Text ví d
function extractRoomInfo(text) {
  const ma = text.match(/Mã\s*:\s*(.*)/)?.[1]?.trim();
  const diaChi = text.match(/Địa chỉ\s*:\s*(.*)/)?.[1]?.trim();
  const gia = text.match(/(?:GIÁ|Giá|giá|GIá|GiÁ)\s*:\s*(.*)/)?.[1]?.trim();
  const phong = text.match(/Phòng\s*:\s*(.*)/)?.[1]?.trim();
  const noiThat = text.match(/Nội thất\s*:\s*(.*)/)?.[1]?.trim();
  const match = text.match(/⏰\s*(.+)/);
  const thoiGianTrong = match ? match[1].trim() : "";
  const luuY =
    (text.match(/(?:LƯU Ý|Lưu ý)\s*([\s\S]*)/) || [])[1]?.trim() || "";

  // Dịch vụ xuống dòng khi gặp dấu phẩy
  let dichVu = text
    .match(/❣Dịch vụ\s*:\s*([\s\S]*?)(?=\n\n|⛔|$)/)?.[1]
    ?.trim();
  if (dichVu) {
    dichVu = dichVu.replace(/,\s*/g, "\n"); // xuống dòng
  }

  return { ma, diaChi, gia, phong, noiThat, dichVu, thoiGianTrong, luuY };
}

async function saveToExcel(rooms, filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Phong cho thue");

  // Header
  sheet.addRow([
    "Mã",
    "Địa chỉ",
    "Giá",
    "Thời gian trống",
    "Phòng",
    "Nội thất",
    "Dịch vụ",
    "Lưu Ý",
  ]);

  // Data
  rooms.forEach((r) => {
    sheet.addRow([
      r.ma,
      r.diaChi,
      r.gia,
      r.thoiGianTrong,
      r.phong,
      r.noiThat,
      r.dichVu,
      r.luuY,
    ]);
  });

  // Căn chỉnh ô dịch vụ để xuống dòng
  sheet.getColumn(7).alignment = { wrapText: true };

  await workbook.xlsx.writeFile(filePath);
  console.log(`Đã lưu file Excel: ${filePath}`);
}

// Giả sử bạn có nhiều tin nhắn, tách theo 🌹
const allRooms = rooms
  .split(/(?=🌹)/)
  .map((block) => extractRoomInfo(block))
  .filter((r) => r.ma); // bỏ block rỗng

saveToExcel(allRooms, "phong.xlsx");
