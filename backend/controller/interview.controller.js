const express = require("express");
const uuid = require("uuid");
require("dotenv").config();
const { Groq } = require("groq-sdk");   // ✅ use groq instead of openai
const Interview = require("../model/interview");
const { UserModel } = require("../model/user");

// ✅ Use GROQ API key from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const startingPrompt = {
  MERN: `You will serve as an interviewer and I will be the interviewee candidate. You have to assess the interviewee's coding, conceptual skills related to the JD provided. Your task is to prepare a series of questions related to the job requirements and skills listed by the interviewee. Please ask each question one-by-one and wait for the interviewee to answer before providing feedback and grading the answer. After the interview, create a comprehensive report identifying areas of improvement, strengths, and an overall grade from 0 to 10.

  Please ensure that each question pertains to the job's requirements and the interviewee's skills and expertise.Stop the interview when the I say "stop the interview" and give a detailed feedback in form of an object, following this schema(except the interview key) :const feedbackSchema = new mongoose.Schema({
    interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }, 
    strengths: [{ type: String }], 
    improvementAreas: [{ type: String }], 
    overallScore: { type: Number }, 
  });
  
  JD: MERN, MongoDB, Express, React and Node (Junior)
  Skills: Express, React, Node.
  Just ask one question at a time and wait for me to give the answer then ask new question do not give response to user for answer just move next question. Do not give all the questions at once. Ask the questions one by one.Greet the user first before going on to the first question`,

  JAVA: `You will serve as an interviewer and I will be the interviewee candidate. You have to assess the interviewee's coding, conceptual skills related to the JD provided. Your task is to prepare a series of questions related to the job requirements and skills listed by the interviewee. Please ask each question one-by-one and wait for the interviewee to answer before providing feedback and grading the answer. After the interview, create a comprehensive report identifying areas of improvement, strengths, and an overall grade from 0 to 10.

  Please ensure that each question pertains to the job's requirements and the interviewee's skills and expertise.Stop the interview when the I say "stop the interview" and give a detailed feedback in form of an object, following this schema(except the interview key) :const feedbackSchema = new mongoose.Schema({
    interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }, 
    strengths: [{ type: String }], 
    improvementAreas: [{ type: String }], 
    overallScore: { type: Number }, 
  });
  
  JD: Java, SpringBoot
  Skills: Java, Spring Boot, Hibernate
  Just ask one question at a time and wait for me to give the answer then ask new question do not give response to user for answer just move next question. Do not give all the questions at once. Ask the questions one by one.Greet the user first before going on to the first question`,
};

const endInterviewPrompt = `Stop the interview. Give me detailed feedback according to feedbackSchema = new mongoose.Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }, 
  strengths: [{ type: String }], 
  improvementAreas: [{ type: String }], 
  overallScore: { type: Number }, 
});`;


// ✅ Start Interview
const startInterview = async (req, res, next) => {
  const { type } = req.body;

  try {
    const conversation = [{ role: "user", content: startingPrompt[type] }];

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",   // ✅ Groq model
      messages: conversation,
    });

    const question = response.choices[0].message.content;

    const newinterview = new Interview({
      userId: req.userId,
      type: type,
      conversation: [...conversation, { role: "assistant", content: question }],
      feedback: null,
    });

    await newinterview.save();

    res.status(200).json({ msg: "Interview Is Started Now", question, newinterview });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// ✅ End Interview
const EndInterview = async (req, res, next) => {
  const { conversation } = req.body;
  const userId = req.userId;
  const { id } = req.params;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [...conversation, { role: "user", content: endInterviewPrompt }],
    });

    const endObj = response.choices[0].message.content;

    const newInterview = await Interview.findByIdAndUpdate(
      id,
      { conversation, feedback: endObj },
      { new: true }
    );

    const loginUser = await UserModel.findById(newInterview.userId);

    const pastInterview = await UserModel.findByIdAndUpdate(
      userId,
      { userPastInterview: [...loginUser.userPastInterview, id] },
      { new: true }
    );

    res.status(200).json({
      msg: "Interview is stopped now",
      endObj,
      endInterviewPrompt,
      pastInterview,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// ✅ AI Response (next question)
const AiResponse = async (req, res, next) => {
  try {
    const { conversation } = req.body;
    const { id } = req.params;

    let response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: conversation,
    });

    let nextQuestion = response.choices[0].message.content;

    await Interview.findByIdAndUpdate(id, { conversation });

    res.json({ answer: nextQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  endInterviewPrompt,
  startingPrompt,
  EndInterview,
  startInterview,
  AiResponse,
};
