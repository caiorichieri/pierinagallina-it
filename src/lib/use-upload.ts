import { useServerFn } from "@tanstack/react-start";
import { useCallback } from "react";
import { db } from "@/integrations/pierina/client";
import { uploadMedia } from "@/lib/upload.functions";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      resolve(r.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Carica un file su storage e restituisce l'URL pubblico firmato. */
export function useUpload() {
  const upload = useServerFn(uploadMedia);

  return useCallback(
    async (file: File): Promise<string> => {
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(`File troppo grande (max 15MB): ${file.name}`);
      }
      const { data: s } = await db.auth.getSession();
      const token = s.session?.access_token ?? "";
      if (!token) throw new Error("Sessione scaduta: rifai il login.");
      const dataBase64 = await fileToBase64(file);
      const res = await upload({
        data: {
          token,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          dataBase64,
        },
      });
      return res.url;
    },
    [upload],
  );
}
