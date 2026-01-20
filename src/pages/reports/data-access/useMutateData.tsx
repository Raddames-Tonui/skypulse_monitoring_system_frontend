import {useCallback, useState} from "react";
import axiosClient from "@/utils/constants/axiosClient.tsx";
import {saveAs} from "file-saver";

export function useSslReportDownload() {
    const [isProcessing, setIsProcessing] = useState(false);

    const downloadPdfReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/ssl", {
                params: {period: 14},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/pdf"});
            saveAs(blob, `ssl-report.pdf`);
        } catch (err) {
            console.error("Failed to download SSL report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const previewPdfReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/ssl", {
                params: {period: 14},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to preview SSL report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const downloadSslReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/xlsx/ssl", {
                params: {period: 14},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, `ssl-report.xlsx`);
        } catch (err) {
            console.error("Failed to download SSL report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const previewSslReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/xlsx/ssl", {
                params: {period: 14},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to preview SSL report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {isProcessing, downloadPdfReport, previewPdfReport, downloadSslReport, previewSslReport};
}

export function useUptimeReportDownload() {
    const [isProcessing, setIsProcessing] = useState(false);

    const downloadPdfReport = useCallback(async (filters?: Record<string, string | number | (string | number)[]>) => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/uptime", {
                params: filters || {},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/pdf"});
            saveAs(blob, `uptime-report.pdf`);
        } catch (err) {
            console.error("Failed to download report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const previewPdfReport = useCallback(async (filters?: Record<string, string | number | (string | number)[]>) => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/uptime", {
                params: filters || {},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to preview report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const downloadSslReport = useCallback(async (filters?: Record<string, string | number | (string | number)[]>) => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/xlsx/uptime", {
                params: filters || {},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, `uptime-report.xlsx`);
        } catch (err) {
            console.error("Failed to download report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const previewSslReport = useCallback(async (filters?: Record<string, string | number | (string | number)[]>) => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/xlsx/uptime", {
                params: filters || {},
                responseType: "blob",
            });

            const blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to preview report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {isProcessing, downloadPdfReport, previewPdfReport, downloadSslReport, previewSslReport};
}