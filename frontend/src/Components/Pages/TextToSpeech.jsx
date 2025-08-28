import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Speak } from "./Speak";
import { useDispatch } from "react-redux";
import { Latest_Message } from "../redux/actionType";

export const TextToSpeech = ({ conversation, setConversation, interview }) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [render, setRender] = useState(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Keep mic instance in a ref so it doesn't recreate on re-render
  const micRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    micRef.current = new SpeechRecognition();
    micRef.current.continuous = true;
    micRef.current.interimResults = true;
    micRef.current.lang = "en-US";

    micRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    micRef.current.onend = () => {
      if (isListening) {
        micRef.current.start(); // restart if listening
      }
    };
  }, []); // run once on mount

  useEffect(() => {
    if (!micRef.current) return;

    if (isListening) {
      micRef.current.start();
    } else {
      micRef.current.stop();
    }
  }, [isListening, render]);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/gpt/${interview._id}`,
        {
          conversation: [
            ...conversation,
            { role: "user", content: text.trim() },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");
      setConversation([
        ...conversation,
        { role: "user", content: text.trim() },
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);

      dispatch({ type: Latest_Message, payload: response.data.answer });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button
            onClick={() => setIsListening(true)}
            disabled={isListening}
            className="btn-outline"
          >
            Start
          </button>{" "}
          <button
            onClick={() => setIsListening(false)}
            disabled={!isListening}
            className="btn-outline"
          >
            Stop
          </button>
        </div>

        <button onClick={handleSubmit} className="btn">
          Send
        </button>
      </div>

      <br />

      <div>
        <textarea
          className="border border-1 border-gray-500 p-4"
          rows="4"
          cols="50"
          placeholder="Type your response or speak..."
          value={text}
          onChange={handleChange}
        />
        <Speak />
      </div>
    </>
  );
};
