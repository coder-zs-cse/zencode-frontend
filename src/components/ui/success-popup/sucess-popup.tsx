import React from "react";
import { CheckCircle } from "lucide-react";

export const SuccessPopup = () => (
  <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded shadow">
    <CheckCircle className="inline-block mr-2" />
    Files exported successfully!
  </div>
);
