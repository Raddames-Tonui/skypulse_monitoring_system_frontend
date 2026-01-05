import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";

interface UploadContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadContactsModal({ isOpen, onClose }: UploadContactsModalProps) {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    // -------- MUTATION FOR UPLOAD --------
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
            // Auto download XLSX returned by server
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

    return (
        <Modal
            isOpen={isOpen}
            title="Upload User Contacts CSV"
            onClose={onClose}
            body={
                <div className="csv-modal">
                    <div
                        className="csv-div"
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
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
