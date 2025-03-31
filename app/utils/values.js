import { Empty } from "antd";

export const customLocale = {
  filterTitle: "Шүүлтүүр",
  filterConfirm: "Сонгох",
  filterReset: "Цэвэрлэх",
  // filterEmptyText: "Өгөгдөл олдсонгүй",
  filterCheckall: "Бүгдийг сонгох",
  filterSearchPlaceholder: "Хайх",
  // emptyText: "Өгөгдөл олдсонгүй",
  selectAll: "Энэ хуудсыг сонгох",
  selectInvert: "Сонголтыг эсрэгээр нь",
  selectNone: "Бүх сонгосныг арилгах",
  selectionAll: "Бүх өгөгдлийг сонгох",
  sortTitle: "Эрэмбэлэх",
  expand: "Мөр өргөтгөх",
  collapse: "Мөр хураах",
  triggerDesc: "Буурахаар эрэмбэлэх",
  triggerAsc: "Өсөхөөр эрэмбэлэх",
  cancelSort: "Эрэмбэлэлт цуцлах",
  emptyText: (
    <Empty
      description="Өгөгдөл олдсонгүй."
      className="py-6"
      image={Empty.PRESENTED_IMAGE_DEFAULT}
    />
  ),
};
