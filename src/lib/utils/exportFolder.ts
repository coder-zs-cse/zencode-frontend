"use client";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Step, FileNode } from "@/types";
import { flattenFileNodes } from "./parsing";

interface TemplateData {
  fileNode?: FileNode[];
}

export const exportToZip = async (data: TemplateData) => {
  try {
    const zip = new JSZip();

    const flattenedFiles = flattenFileNodes(data.fileNode || []);
    flattenedFiles.forEach((file) => {
      zip.file(file.filePath, file.fileContent);
    });

    const zipContent = await zip.generateAsync({ type: "blob" });

    saveAs(zipContent, "template-files.zip");
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't export files");
  }
};
