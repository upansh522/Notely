"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface paymentIntentType {
  data: {
    message: string;
    url: string;
  };
}
const page = () => {
  const { user } = useUser();
  const plan = useQuery(api.user.fetchUserPlan, {
    email: user?.primaryEmailAddress?.emailAddress as string,
  });
  const userUpgradePlan= useMutation(api.user.updateUserPlan)
  const onPaymentSuccess = async () => {
    await userUpgradePlan({
      email: user?.primaryEmailAddress?.emailAddress as string,
    });
    console.log("payment success");
    toast("payment success",{
      description:"your plan has been upgraded successfully",
      
    })
    
  };
  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold">Plans</h2>
      <p>Upgrade your plan to store unlimited notes</p>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
    <div className="rounded-2xl border border-indigo-600 p-6 shadow-xs ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-12">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">
          unlimited
          <span className="sr-only">Plan</span>
        </h2>

        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> 30$ </strong>

          <span className="text-sm font-medium text-gray-700">/month</span>
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> 20 users included </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> 5GB of storage </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> Email support </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> Help center access </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> Phone support </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> Community access </span>
        </li>
      </ul>
      <div className="mt-8">
        <PayPalButtons 
        onApprove={()=>onPaymentSuccess()}
        onCancel={()=> console.log('payment cancelled')}
        createOrder={(data,actions)=>{
          return actions?.order?.create({
            purchase_units:[
              {
                amount:{
                  value:30,
                  currency_code:'USD'               
                }
              } 
            ]
          })
        }}
        />
      </div>
    </div>

    <div className="rounded-2xl border border-gray-200 p-6 shadow-xs sm:px-8 lg:p-12">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">
          Free 
          <span className="sr-only">Plan</span>
        </h2>

        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> 0$ </strong>

          <span className="text-sm font-medium text-gray-700">/month</span>
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> 10 users included </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> 2GB of storage </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> Email support </span>
        </li>

        <li className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-indigo-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>

          <span className="text-gray-700"> Help center access </span>
        </li>
      </ul>

      <a href="#" className="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600">
        Get Started
      </a>
    </div>
  </div>
</div>
    </div>
  );
};
export default page;
