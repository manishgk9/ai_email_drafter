import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPrompt, setSubject, setBody } from "../redux/emailSlice";
import { generateEmail } from "../redux/services/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EmailStuffPage() {
  const dispatch = useDispatch();
  const [copyStatus, setCopyStatus] = useState("Copy Email Draft");
  const quillRef = useRef(null);
  const { prompt, recipients, subject, body, status, error } = useSelector(
    (s) => s.email
  );

  const loading = status === "loading" || status === "sending";

  const onGenerate = () => {
    const recipList = recipients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dispatch(generateEmail({ prompt, recipients: recipList }));
  };

  const onCopyDraft = () => {
    const contentToCopy = quillRef.current.getEditor().getText();
    if (navigator.clipboard && contentToCopy.trim()) {
      navigator.clipboard
        .writeText(contentToCopy)
        .then(() => {
          setCopyStatus("Copied !");
          setTimeout(() => setCopyStatus("Copy Email Draft"), 2000);
        })
        .catch(() => {
          setCopyStatus("Failed to Copy");
          setTimeout(() => setCopyStatus("Copy Email Draft"), 2000);
        });
    }
  };

  const emailGenerated = subject.trim() !== "" || body.trim() !== "";

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-2xl border border-gray-200 mt-12">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
        AI Email Drafter
      </h1>

      {/* Prompt */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-semibold">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => dispatch(setPrompt(e.target.value))}
          className="border p-3 w-full h-32 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="e.g. Write a friendly follow-up for a job interview..."
        />
      </div>
      {/* error  */}

      {status === "failed" && (
        <p className="text-red-500 font-medium text-center pb-5">
          {error || "Failed"}
        </p>
      )}

      {/* Generate Button */}
      <div className="flex gap-3 mb-6 pl-5 pr-5">
        <button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full px-6 py-3 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
            loading || !prompt.trim()
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading && status === "loading" ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating...
            </>
          ) : (
            "Generate Email Draft"
          )}
        </button>
      </div>

      {/* Email Editor */}
      {emailGenerated && (
        <div className="mt-6">
          <hr className="my-6 border-gray-300" />

          {/* Subject */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-semibold">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => dispatch(setSubject(e.target.value))}
              className="border p-3 w-full rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Body with ReactQuill */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-semibold">
              Body
            </label>
            <ReactQuill
              ref={quillRef}
              value={body}
              onChange={(value) => dispatch(setBody(value))}
              className="bg-white rounded-xl shadow-inner"
              theme="snow"
            />
          </div>

          {/* Copy Draft Button */}
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={onCopyDraft}
              // className="w-full px-6 py-3 rounded-xl text-white bg-green-600 hover:bg-green-700 font-semibold shadow-lg transition"
              className={` px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                copyStatus === "Copied !"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {copyStatus}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
