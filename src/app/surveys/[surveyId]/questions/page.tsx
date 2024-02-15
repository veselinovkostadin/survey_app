"use client";
import { SurveyListDTO } from "@/types/SurveyListDTO";
import { redirect, useParams } from "next/navigation";
import { FormEventHandler, useEffect,useState } from "react";

export default function PublicSurveysPage() {
  const [questions, setQuestions] = useState([]);
  const [arrIndex,setIndex] = useState<number>(0);
//   const [answer,setAnswer] = useState<string>();
  const { surveyId } = useParams();
  
  const getQuestions = async () =>{
    const response = await fetch(`/api/surveys/${surveyId}`);
    const {data} = await response.json();
    setQuestions(data.questions)
  }

  const handleNextQuestion: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        const {currentTarget} = e;
        const formData = new FormData(currentTarget);
        const answer = formData.get("answer") as string;

        const questionId = questions[arrIndex].id


        const response = await fetch(`/api/surveys/${surveyId}/questions/${questionId}/answers`, {
            method: "POST",
            body: JSON.stringify({answer}),
        });
    
        console.log(answer)
    
    setIndex((prevIndex) => prevIndex + 1)
  }

  useEffect(() => {
    getQuestions();
  },[]);

  useEffect(()=>{
    if (arrIndex == questions.length - 1){
        const submitBtn = document.getElementById("submitBtn")
        submitBtn.innerText = "Finish"
    }

    // if(arrIndex >= questions.length){

    // }

  },[arrIndex])


  return (
    <div className="w-10/12 h-10/12 flex space-y-8 flex-col">
      <div className="bg-white flex flex-col items-center justify-center space-y-4 rounded-xl shadow pt-5">
        <h3 className="text-md text-center text-emerald-600">Question {arrIndex}</h3>

        <h4 className="pt-10">{questions[arrIndex]?.text ?? "No questions found."} <span className="danger">{questions[arrIndex]?.required ? "*" : ""}</span></h4>

       
        <form className="flex flex-col gap-5 w-10/12" onSubmit={handleNextQuestion}>
            <textarea
                id="areaAnswer"
                name="answer"
                rows={4}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none disabled:cursor-defaut"
                required={questions[arrIndex]?.required || false}
            ></textarea>
            <div className="w-full flex justify-end items-center py-2 pb-4">
                <button id="submitBtn" type="submit" className={"px-12 py-2 text-white rounded-md mt-5 shadow uppercase"} style={{backgroundColor:'rgb(4 120 87)'}}
                disabled={arrIndex >= questions.length}>next</button>
            </div>
        </form>
        
      </div>

    </div>
  );
}

