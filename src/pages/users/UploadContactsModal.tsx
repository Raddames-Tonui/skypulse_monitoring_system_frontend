import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
import Icon from "@/utils/Icon";

interface UploadContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadContactsModal({ isOpen, onClose }: UploadContactsModalProps) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const mutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosClient.post("/csv/user-contacts", formData, {
                responseType: "blob",
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data;
        },
        onSuccess: (data: Blob) => {
            const url = URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "invalid_user_contacts.xlsx";
            a.click();
            URL.revokeObjectURL(url);

            setFile(null);
            setError(null);
            onClose();
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err: any) => {
            setError(err?.response?.data?.message || err.message || "Upload failed");
        },
    });

    const handleFile = (file: File) => {
        if (!file.name.endsWith(".csv")) {
            setError("Only CSV files are allowed");
            return;
        }
        setError(null);
        setFile(file);
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Upload User Contacts CSV"
            onClose={onClose}
            body={
                <div className="file-upload-wrapper">
                    <div
                        className={`file-upload-dropzone ${isDragging ? "dragging" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files[0]) {
                                handleFile(e.dataTransfer.files[0]);
                            }
                        }}
                    >
                        <Icon iconName="fileUploadLight" className="file-upload-icon" />

                        <div className="file-upload-text">
                            <strong>Browse</strong> or drop file here
                        </div>

                        {file && (
                            <div className="file-upload-filename">
                                {file.name}
                            </div>
                        )}

                        {error && (
                            <div className="file-upload-error">{error}</div>
                        )}

                        <input
                            ref={fileInputRef}
                            className="file-upload-input"
                            type="file"
                            accept=".csv, .xlsx"
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                        />
                    </div>
                </div>
            }
            footer={
                <>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => file && mutation.mutate(file)}
                        disabled={!file || mutation.isPending}
                    >
                        {mutation.isPending ? "Uploading..." : "Upload"}
                    </button>
                </>
            }
        />
    );
}
