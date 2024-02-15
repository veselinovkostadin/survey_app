import SurveyForm from "@/components/SurveyForm/SurveyForm";
import { SurveyDTO } from "@/types/SurveyDTO";
import { SurveyStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export default function SurveyCreatePage() {
  
  const createSurvey = async (formData: FormData) => {
    "use server";
    const data: Partial<SurveyDTO["data"]> = {
      name: formData.get("name") as string,
      manager: formData.get("manager") as string,
      introduction: formData.get("introduction") as string,
      status: formData.get("status") as SurveyStatus,
    };

    const response = await fetch(`${process.env.API_URL}/surveys`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const jsonData = await response.json();

    redirect(`${process.env.APP_URL}/dashboard/surveys`)
  };

  return <SurveyForm title="Create a Survey" updateSurvey={createSurvey} />;
}
