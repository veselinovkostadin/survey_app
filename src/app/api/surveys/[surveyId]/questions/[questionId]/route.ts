import routeHandler from "@/lib/routeHandler";
import prisma from "@/lib/prisma";
import Answer from "@/schemas/Answer";
// import { NextRequest, NextResponse } from "next/server";
import { isUndefined } from "lodash";


export const PATCH = routeHandler(async (request, context) => {
  const { surveyId, questionId } = context.params;
  const data = await request.json();

  const question = await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      surveyId,
    },
  });

  console.log(data.position, question.position);

  if (!isUndefined(data.position) && question.position !== data.position) {
    const [positionFrom, positionTo] = [
      question.position,
      data.position,
    ].sort();

    const questionsToReposition = await prisma.question.findMany({
      where: {
        id: questionId,
        surveyId,
        position: {
          in: Array.from(
            { length: positionTo - positionFrom + 1 },
            (_, index) => positionFrom + index
          ),
        },
      },
    });

    console.log({
      questionsToReposition,
    });
  }

  const response = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        update: {
          where: {
            id: questionId,
          },
          data,
        },
      },
    },
  });

  return response;
});

export const DELETE = routeHandler(async (_, context) => {
  const { surveyId, questionId } = context.params;
  const response = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        delete: {
          id: questionId,
        },
      },
    },
    include: {
      questions: true,
    },
  });

  return response;
});

//  answer the specific question
export const POST = routeHandler(async(request,context) => {
  const { questionId } = context.params;
  
  const question = await prisma.question.findUniqueOrThrow({
    where:{
      id: questionId,
    },
  });
  
  const body = await request.json();
  const validation = await Answer.safeParseAsync(body);

  if (!validation.success){
    throw validation.error;
  }

  const { data } = validation;

  const answerQ = await prisma.question.update({
    where:{
      id: questionId,
    },
    data:{
      answers:{
        create:{
          ...data,
        }
      }
    },
    include:{
      answers: true,
    },
  });

  return answerQ
})

//  get all answers for a specific question
export const GET = routeHandler(async (request,context) => {
  const { questionId } = context.params;

  const answers = await prisma.questionAnswer.findMany({
    where:{
      questionId: questionId
    }
  })
  
  return answers
})
