"use client";
import { SurveyListDTO } from "@/types/SurveyListDTO";
import { redirect, useParams } from "next/navigation";
import { useEffect,useState } from "react";
import Link from "next/link"

export default function PublicSurveysPage() {
  const [survey, setSurvey] = useState<SurveyListDTO["data"]>([]);
  const { surveyId } = useParams();
  
  const getSurvey = async () =>{
    const response = await fetch(`/api/surveys/${surveyId}`);
    const {data} = await response.json();
    console.log(data)
    setSurvey(data);
  }

  useEffect(() => {
    getSurvey();
  },[]);

  return (
    <div className="w-10/12 flex space-y-8 flex-col">
      <div className="bg-white h-20 flex items-center justify-center rounded-xl shadow">
          <h3 className="text-xl font-semibold">{survey?.name ?? "No survey found."}</h3>
      </div>

      <div className="h-20 flex items-center justify-center rounded-xl shadow" style={{backgroundColor:'rgba(255,255,255,0.8)'}}>
          <h3 className="text-md">{survey?.introduction ?? "No survey found."}</h3>
      </div>

      <div className="flex justify-center items-center">
          <button className={"px-12 py-2 text-white rounded-md mt-5 shadow"} style={{backgroundColor:'rgb(4 120 87)'}}><Link href={`./${surveyId}/questions`}>START
</Link></button>
      </div>

    </div>
  );
}
