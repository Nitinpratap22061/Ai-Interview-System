import React, { useState } from "react";
import axios from "axios";

export const Logic = ({ conversation, setConversation, interview, token }) => {
  const [text, setText] = useState("");

  const startingPrompt = {
    MERN: `Hi, let's start the interview for MERN. Ask 1 question at a time, wait for user response. If response is wrong or partially correct, give correct answer & feedback. Then ask next question.`,
    JAVA: "Hi, let's start the interview for JAVA",
  };

  const UpdateInterviewPrompt = `Give 1 question at a time. Wait for user response before next question.`;

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/gpt/${interview._id}`,
        { conversation: [...conversation, { role: "user", content: text }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversation([
        ...conversation,
        { role: "user", content: text },
        { role: "assistant", content: response.data.answer },
      ]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        className="border border-gray-500 p-2 w-full"
        rows="4"
        placeholder="Type your response..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="btn bg-gray-800 text-white mt-2 px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};
