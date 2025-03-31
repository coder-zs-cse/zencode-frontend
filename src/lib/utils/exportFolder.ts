"use client";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Step } from "@/types";

interface TemplateData {
  template: Step[];
}

export const exportToZip = async (data: TemplateData) => {
  try {
    const zip = new JSZip();
    data.template.forEach((file) => {
      if (file.path && file.content) {
        zip.file(file.path, file.content);
      } else if (file.path) {
        zip.file(file.path, null, { dir: true });
      }
    });

    const zipContent = await zip.generateAsync({ type: "blob" });

    saveAs(zipContent, "template-files.zip");
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't export files");
  }
};
