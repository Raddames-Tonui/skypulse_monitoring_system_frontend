import React, { useState } from "react";
import Modal from "@/components/Modal";
import Icon from "@/utils/Icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import MonitoredServiceForm from "./MonitoredServiceForm";
import { Route } from "@/routes/_protected/services";
import type { MonitoredServiceData } from "./UseMonitoredServices";

interface MonitoredServiceActionsProps {
  service: MonitoredServiceData;
}

const MonitoredServiceActions: React.FC<MonitoredServiceActionsProps> = ({ service }) => {
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

  const openModal = (title: string, body: React.ReactNode, footer?: React.ReactNode) => {
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer || null);
    setIsModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (uuid: string) => {
      const res = await axiosClient.delete(`/service/${uuid}`);
      if (res.status !== 200) throw new Error("Failed to delete service");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitored-services"] });
      toast.success("Service deleted successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete service"),
  });

  const handleEdit = () => {
    openModal(
      "Edit Monitored Service",
      <MonitoredServiceForm
        serviceData={service}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["monitored-services"] })}
      />
    );
  };

  const handleDelete = () => {
    openModal(
      "Delete Monitored Service",
      <div
        style={{
          color: "#f02929cc",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Icon iconName="dangerIcon" style={{ height: "70px", color: "#f02929cc" }} />
        <h3>Are you sure you want to delete this service?</h3>
      </div>,
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          className="modal-close-btn"
          style={{ backgroundColor: "#f02929cc" }}
          onClick={() => {
            deleteMutation.mutate(service.uuid); // use UUID, not DB id
            setIsModalOpen(false);
          }}
        >
          Yes, Delete
        </button>
        <button className="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </button>
      </div>
    );
  };

  const handleView = () => {
    navigate({
      to: `/services/$serviceUuid`,
      params: { serviceUuid: service.uuid },
    });
  };

  return (
    <div className="action-icons">
      <button onClick={handleEdit}>
        <Icon iconName="editIcon" style={{ width: "18px" }} /> Edit
      </button>
      <button onClick={handleView}>
        <Icon iconName="eyeView" style={{ width: "18px" }} /> View
      </button>
      <button onClick={handleDelete} disabled={deleteMutation.isPending}>
        <Icon iconName="delete" style={{ width: "18px" }} /> Delete
      </button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          body={modalBody}
          footer={modalFooter}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MonitoredServiceActions;
