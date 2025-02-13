import { Modal, Button } from "antd";
import { DangerTriangleBoldDuotone } from "solar-icons";

const InfoModal = ({ open, onOk, onCancel, text, list }) => {
  return (
    <Modal
      width="400px"
      //title="Анхааруулга"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            className="back border rounded-xl text-[13px] font-medium"
            onClick={onCancel}
          >
            Буцах
          </Button>
          <Button
            className="border-none rounded-xl font-semibold text-white bg-main"
            onClick={onOk}
          >
            Эхлүүлэх
          </Button>
        </div>
      }
    >
      <div className="text-main flex justify-center">
        <DangerTriangleBoldDuotone width={60} height={60} />
      </div>
      <div className="pt-4 pb-2 text-center leading-5">{text}</div>
      <div
        dangerouslySetInnerHTML={{ __html: list }}
        className="leading-5 text-justify px-5 pb-2 pl-7"
      ></div>
    </Modal>
  );
};

export default InfoModal;
