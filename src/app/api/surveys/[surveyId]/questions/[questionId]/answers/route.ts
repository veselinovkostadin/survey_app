import routeHandler from "@/lib/routeHandler";
import prisma from "@/lib/prisma";
import QuestionAnswer from "@/schemas/QuestionAnswer";
import { HfInference } from "@huggingface/inference";

export const POST = routeHandler(async (request, context) => {
  const { questionId } = context.params;

  const survey = await prisma.question.findUniqueOrThrow({
    where: {
      id: questionId,
    },
  });

  const body = await request.json();

  const validation = await QuestionAnswer.safeParseAsync(body);

  if (!validation.success) {
    throw validation.error;
  }

  const { data } = validation;

  const hf = new HfInference();
  const sentiment = await hf.textClassification({
    model: "distilbert-base-uncased-finetuned-sst-2-english",
    inputs: data.answer,
  });

  const questionAnswer = await prisma.questionAnswer.create({
    data: { ...data, questionId },
  });

  return { questionAnswer, sentiment };
});
