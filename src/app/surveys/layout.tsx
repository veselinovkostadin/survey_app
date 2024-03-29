import { url } from "inspector";
import React from "react";

export default function PublicSurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="w-screen h-screen relative" style={{backgroundImage: 'url("/images/background/green_bg.png")'}}>
      <div className="w-full h-full flex justify-center items-center z-0">
        <div className="w-4/5 h-4/5 flex justify-center items-center rounded-lg z-0" style={{backgroundColor: "rgba(229,229,229,0.6)",boxShadow:"0px 0px 12px rgba(0,0,0,0.7)"}}>
          {children}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 d-none hidden" id="finish-popup" style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
          <div className="bg-white rounded-md w-max h-max p-8 text-center">
              <h3>Thank you for participating in this survey!</h3>
          </div>
      </div>

    </div>
    );
}